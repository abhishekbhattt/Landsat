import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import L from "leaflet";
import emailjs from "@emailjs/browser";

const redMarkerIcon = new L.Icon({
  iconUrl: "src/mediaContent/satellitem.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Function to remove all satellite markers from the map
const clearSatelliteMarkers = (satelliteMarkers, map) => {
  satelliteMarkers.forEach((marker) => {
    map.removeLayer(marker);
  });
};

const API_KEY = "KTL5EU-8LUF35-Y3H5GH-5BYE";
const SAT_IDS = [6126, 39084, 49260, 25682, 14780, 13367, 10702, 7615];

// Create Satellite Context
const SatelliteContext = React.createContext();
export const useSatellite = () => useContext(SatelliteContext);

const SatelliteProvider = ({
  userLocation,
  radius,
  notifyUser,
  map,
  children,
}) => {
  const { lat, lng } = userLocation;
  const { currentUser } = useSelector((state) => state.user);
  const userEmail = currentUser?.email;
  const userName = currentUser?.username;
  const [satelliteMarkers, setSatelliteMarkers] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState("");
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [isLandsatClose, setLandsatClose] = useState(false);
  const [satelliteData, setSatelliteData] = useState(null);
  const [satlatitude, setSatlatitude] = useState(null);
  const [satlongitude, setSatlongitude] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const emailSentRef = useRef(false); // Using useRef to avoid continuous re-rendering

  const sendEmailNotification = async () => {
    if (userEmail) {
      const emailParams = {
        to_email: userEmail,
        to_name: userName,
        message: `The ${satelliteData.info.satname} satellite is in ${radius} km of your range.`,
      };

      try {
        await emailjs.send(
          "service_e9ug2ap", // Replace with your EmailJS service ID
          "template_cam7lqk", // Replace with your EmailJS template ID
          emailParams,
          "WoGDdq3gPXKPBZvbm" // Replace with your EmailJS public key
        );
        setEmailSent(true);
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }
  };

  const checkProximity = (satellitePosition, userPosition) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (satellitePosition.lat - userPosition.lat) * (Math.PI / 180);
    const dLng = (satellitePosition.lng - userPosition.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(userPosition.lat * (Math.PI / 180)) *
        Math.cos(satellitePosition.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const fetchSatelliteData = useCallback(async () => {
    if (!map || !selectedSatellite) return;

    try {
      clearSatelliteMarkers(satelliteMarkers, map);
      setSatelliteMarkers([]);

      const response = await axios.get(
        `https://thingproxy.freeboard.io/fetch/https://api.n2yo.com/rest/v1/satellite/positions/${selectedSatellite}/${lat}/${lng}/0/2/?apiKey=${API_KEY}`
      );

      const data = response.data;

      if (!data.positions || data.positions.length === 0) {
        return;
      }

      const { satlatitude, satlongitude } = data.positions[0];
      setSatlatitude(satlatitude);
      setSatlongitude(satlongitude);

      const marker = L.marker([satlatitude, satlongitude], {
        icon: redMarkerIcon,
      })
        .addTo(map)
        .bindPopup(`${data.info.satname}`);

      setSatelliteMarkers((prevMarkers) => [...prevMarkers, marker]);

      const currentDistance = checkProximity(
        { lat: satlatitude, lng: satlongitude },
        userLocation
      );
      setDistance(currentDistance);

      // Check if Landsat is within the specified radius
      const landsatClose = currentDistance <= radius; // Dynamic radius
      setLandsatClose(landsatClose);

      if (landsatClose && !emailSentRef.current) {
        sendEmailNotification();
        emailSentRef.current = true; // Set to true after sending email
      } else if (!landsatClose) {
        emailSentRef.current = false; // Reset when satellite is out of range
      }

      const speed = 7.8; // km/s
      const estimatedTime = currentDistance / speed; // time in seconds
      setTime(estimatedTime);
      setSatelliteData(data);
    } catch (error) {
      console.error("Error fetching satellite data:", error);
    }
  }, [
    map,
    selectedSatellite,
    userLocation,
    radius,
    emailSent,
    satelliteMarkers,
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedSatellite) {
        fetchSatelliteData();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fetchSatelliteData, selectedSatellite]);

  return (
    <SatelliteContext.Provider value={{ fetchSatelliteData }}>
      <div className="flex flex-col items-center justify-center p-6 bg-gray-100">
        <label
          htmlFor="satelliteSelect"
          className="text-lg font-semibold text-gray-700 mb-2"
        >
          Select a satellite:
        </label>
        <select
          id="satelliteSelect"
          value={selectedSatellite}
          onChange={(e) => setSelectedSatellite(Number(e.target.value))}
          className="w-full sm:w-64 px-4 py-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="" disabled>
            -- Select a satellite --
          </option>
          {SAT_IDS.map((satId) => (
            <option key={satId} value={satId}>
              {satId}
            </option>
          ))}
        </select>

        {distance !== null && time !== null && satelliteData && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mt-6 space-y-4">
            <h3 className="text-xl font-semibold text-center text-blue-600">
              {satelliteData.info.satname} Satellite Data
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold">Distance to Satellite:</span>{" "}
              {distance.toFixed(2)} km
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Satellite Latitude:</span>{" "}
              {satlatitude}°
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Satellite Longitude:</span>{" "}
              {satlongitude}°
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">
                Estimated Time to Reach User:
              </span>{" "}
              {time.toFixed(2)} seconds
            </p>
          </div>
        )}
      </div>

      {children}
    </SatelliteContext.Provider>
  );
};

export default SatelliteProvider;
