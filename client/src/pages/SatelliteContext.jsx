<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useContext } from "react";
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

  const sendEmailNotification = async () => {
    if (userEmail) {
      const emailParams = {
        to_email: userEmail,
        to_name: userName,

        message: `The ${satelliteData.info.satname} satellite is in ${radius} km of your Range`,
      };

      try {
        await emailjs.send(
          "service_vzw8rsn", // Replace with your EmailJS service ID
          "template_y3jbvi1", // Replace with your EmailJS template ID
          emailParams,
          "0SDjTOB4zK7vrG5QG" // Replace with your EmailJS public key
        );
        // console.log(`SUCCESS! Email sent to ${userEmail}`);
        setEmailSent(true); // Ensure email is not sent repeatedly
      } catch (error) {
        // console.log("FAILED...", error.text);
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

      if (landsatClose && !emailSent) {
        sendEmailNotification();
      }

      if (!landsatClose) {
        setEmailSent(false); // Reset emailSent when Landsat is out of range
      }

      const speed = 7.8; // km/s
      const estimatedTime = currentDistance / speed; // time in seconds
      setTime(estimatedTime);
      setSatelliteData(data);
    } catch (error) {
      // console.error("Error fetching satellite data:", error);
      // alert("Error fetching satellite data. Please try again later.");
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
      <div>
        <label htmlFor="satelliteSelect">Select a satellite: </label>
        <select
          id="satelliteSelect"
          value={selectedSatellite}
          onChange={(e) => setSelectedSatellite(Number(e.target.value))}
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
          <div>
            <h3 className="font-bold m-4px">
              {satelliteData.info.satname} Satellite Data
            </h3>
            <p>Distance to Satellite: {distance.toFixed(2)} km</p>
            <p>Satellite Latitude: {satlatitude}°</p>
            <p>Satellite Longitude: {satlongitude}°</p>
            <p>Estimated Time to Reach User: {time.toFixed(2)} seconds</p>
          </div>
        )}
      </div>
      {children}
    </SatelliteContext.Provider>
  );
};

export default SatelliteProvider;

// import React, { useEffect, useCallback, useRef, useState } from "react";
// import axios from "axios";
// import L from "leaflet";

// const SatelliteTracker = ({ userLocation, notifyUser, map }) => {
//   const [satelliteData, setSatelliteData] = useState({});
//   const [satelliteMarkers, setSatelliteMarkers] = useState({});

//   const API_KEY = "KTL5EU-8LUF35-Y3H5GH-5BYE";
//   const SAT_IDS = [6126, 39084, 49260, 25682, 14780, 13367, 10702, 7615];

//   // Custom black marker icon for satellite
//   const satelliteIcon = L.icon({
//     iconUrl: "https://example.com/black-marker.png", // Replace with the actual URL to the black marker icon
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//   });

//   const checkProximity = (satelliteLocation, userLocation) => {
//     const distanceThreshold = 100; // in km
//     const toRadians = (degree) => degree * (Math.PI / 180);
//     const earthRadiusKm = 6371;

//     const dLat = toRadians(satelliteLocation.lat - userLocation.lat);
//     const dLon = toRadians(satelliteLocation.lng - userLocation.lng);

//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(toRadians(userLocation.lat)) *
//         Math.cos(toRadians(satelliteLocation.lat)) *
//         Math.sin(dLon / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = earthRadiusKm * c;

//     return distance <= distanceThreshold;
//   };

//   const fetchSatelliteData = useCallback(async () => {
//     if (!map) return; // Exit if map is not available

//     try {
//       const newSatelliteData = {};
//       const newSatelliteMarkers = { ...satelliteMarkers };

//       for (const SAT_ID of SAT_IDS) {
//         const response = await axios.get(
//           `https://thingproxy.freeboard.io/fetch/https://api.n2yo.com/rest/v1/satellite/positions/${SAT_ID}/${userLocation.lat}/${userLocation.lng}/0/2/?apiKey=${API_KEY}`
//         );
//         const data = response.data;

//         if (!data.positions || data.positions.length === 0) {
//           continue; // Skip this satellite if no position data is available
//         }

//         newSatelliteData[SAT_ID] = data;

//         // Remove old marker if exists
//         if (newSatelliteMarkers[SAT_ID]) {
//           map.removeLayer(newSatelliteMarkers[SAT_ID].marker);
//         }

//         // Get satellite position
//         const { satlatitude, satlongitude } = data.positions[0];

//         // Create a new marker for the satellite
//         const marker = L.marker([satlatitude, satlongitude], {
//           icon: satelliteIcon,
//         })
//           .addTo(map)
//           .bindPopup(`${data.info.satname}`);

//         newSatelliteMarkers[SAT_ID] = { marker };

//         // Check proximity and notify the user
//         if (
//           checkProximity({ lat: satlatitude, lng: satlongitude }, userLocation)
//         ) {
//           if (notifyUser) {
//             if (Notification.permission === "granted") {
//               new Notification("Satellite Overhead", {
//                 body: `${data.info.satname} is currently passing over your location!`,
//               });
//             } else if (Notification.permission !== "denied") {
//               Notification.requestPermission().then((permission) => {
//                 if (permission === "granted") {
//                   new Notification("Satellite Overhead", {
//                     body: `${data.info.satname} is currently passing over your location!`,
//                   });
//                 }
//               });
//             }
//           }
//         }
//       }

//       setSatelliteData(newSatelliteData);
//       setSatelliteMarkers(newSatelliteMarkers);
//     } catch (error) {
//       console.error("Error fetching satellite data", error);
//     }
//   }, [map, satelliteMarkers, userLocation, notifyUser]);

//   useEffect(() => {
//     fetchSatelliteData(); // Initial fetch
//     const intervalId = setInterval(fetchSatelliteData, 10000);
//     return () => clearInterval(intervalId); // Clean up interval on unmount
//   }, [fetchSatelliteData]);

//   return <div>{/* Optionally, you can display satellite data here */}</div>;
// };

// export default SatelliteTracker;
=======
import React, { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import L from "leaflet";

const SatelliteTracker = ({ userLocation, notifyUser, map }) => {
  const [satelliteData, setSatelliteData] = useState({});
  const [satelliteMarkers, setSatelliteMarkers] = useState({});

  const API_KEY = "KTL5EU-8LUF35-Y3H5GH-5BYE";
  const SAT_IDS = [6126, 39084, 49260, 25682, 14780, 13367, 10702, 7615];

  // Use a ref to maintain latlngs across renders
  const latlngsRef = useRef({});
  latlngsRef.current = SAT_IDS.reduce((acc, id) => {
    acc[id] = latlngsRef.current[id] || [];
    return acc;
  }, {});

  const checkProximity = (satelliteLocation, userLocation) => {
    const distanceThreshold = 100; // in km
    const toRadians = (degree) => degree * (Math.PI / 180);
    const earthRadiusKm = 6371;

    const dLat = toRadians(satelliteLocation.lat - userLocation.lat);
    const dLon = toRadians(satelliteLocation.lng - userLocation.lng);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(userLocation.lat)) *
        Math.cos(toRadians(satelliteLocation.lat)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c;

    return distance <= distanceThreshold;
  };

  const fetchSatelliteData = useCallback(async () => {
    if (!map) return; // Exit if map is not available

    try {
      const newSatelliteData = {};
      const newSatelliteMarkers = { ...satelliteMarkers };

      for (const SAT_ID of SAT_IDS) {
        const response = await axios.get(
          `https://thingproxy.freeboard.io/fetch/https://api.n2yo.com/rest/v1/satellite/positions/${SAT_ID}/${userLocation.lat}/${userLocation.lng}/0/2/?apiKey=${API_KEY}`
        );
        const data = response.data;

        if (!data.positions || data.positions.length === 0) {
          continue; // Skip this satellite if no position data is available
        }

        newSatelliteData[SAT_ID] = data;

        // Remove old marker if exists
        if (newSatelliteMarkers[SAT_ID]) {
          map.removeLayer(newSatelliteMarkers[SAT_ID].polyline);
        }

        // Update latlngs
        const latlngs = latlngsRef.current;
        latlngs[SAT_ID].push([
          data.positions[0].satlatitude,
          data.positions[0].satlongitude,
        ]);
        if (latlngs[SAT_ID].length > 2) {
          latlngs[SAT_ID].shift();
        }

        // Create a new polyline for this satellite
        const polyline = L.polyline(latlngs[SAT_ID], { color: "red" })
          .addTo(map)
          .bindPopup(`${data.info.satname}`);
        newSatelliteMarkers[SAT_ID] = { polyline };

        data.positions.forEach((position) => {
          const { satlatitude, satlongitude } = position;
          if (
            checkProximity(
              { lat: satlatitude, lng: satlongitude },
              userLocation
            )
          ) {
            if (notifyUser) {
              if (Notification.permission === "granted") {
                new Notification("Satellite Overhead", {
                  body: `${data.info.satname} is currently passing over your location!`,
                });
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then((permission) => {
                  if (permission === "granted") {
                    new Notification("Satellite Overhead", {
                      body: `${data.info.satname} is currently passing over your location!`,
                    });
                  }
                });
              }
            }
          }
        });
      }

      setSatelliteData(newSatelliteData);
      setSatelliteMarkers(newSatelliteMarkers);
    } catch (error) {
      console.error("Error fetching satellite data", error);
    }
  }, [map, satelliteMarkers, userLocation, notifyUser]);

  useEffect(() => {
    fetchSatelliteData(); // Initial fetch
    const intervalId = setInterval(fetchSatelliteData, 10000);
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, [fetchSatelliteData]);

  return <div>{/* Optionally, you can display satellite data here */}</div>;
};

export default SatelliteTracker;
>>>>>>> b3f7f8eefd5197c69f36ad213f268b75aea55c52
