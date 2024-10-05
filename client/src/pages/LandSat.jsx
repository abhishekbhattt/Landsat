import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";

import Footer from "../components/Footer";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import SatelliteContext from "./SatelliteContext";
export const LandsatContext = createContext();
// Define a red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: "src/mediaContent/redmark.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});
const blueMarkerIcon = new L.Icon({
  iconUrl: "src/mediaContent/bluemark.png",
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const MapComponent = ({ children }) => {
  // const { satelliteData } = useContext(SatelliteContext);
  const mapRef = useRef(null);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [VCoords, VSetCoords] = useState({ lat: null, lng: null });
  const [previousAddress, setPreviousAddress] = useState("");
  const [inputLat, setInputLat] = useState("");
  const [inputLng, setInputLng] = useState("");
  const [radius, setRadius] = useState(1); // Default radius is 1 km
  const [mapInstance, setMapInstance] = useState(null);
  const [previousMarker, setPreviousMarker] = useState(null);
  const [previousCoords, setPreviousCoords] = useState(null);
  const [circle, setCircle] = useState(null); // State to store the circle
  const [trackerKey, setTrackerKey] = useState(0); // Key for re-rendering Tracker

  // for satellite

  useEffect(() => {
    const map = L.map(mapRef.current).setView([51.505, -0.09], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    setMapInstance(map);

    const getLocationFromIP = async () => {
      try {
        const response = await axios.get(
          "https://ipinfo.io/json?token=5c7868fd455088"
        );
        const [latitude, longitude] = response.data.loc.split(",").map(Number);
        setCoords({ lat: latitude, lng: longitude });
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude], { icon: redMarkerIcon })
          .addTo(map)
          .bindPopup("Your approximate location based on IP")
          .openPopup();
      } catch (error) {
        console.error("Error getting IP-based location:", error);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude], { icon: redMarkerIcon }) // Use the red marker icon here
          .addTo(map)
          .bindPopup("You are here")
          .openPopup();
      },
      (error) => {
        console.error("Geolocation error:", error);
        getLocationFromIP();
      }
    );

    const geocoder = L.Control.Geocoder.nominatim();
    L.Control.geocoder({
      geocoder: geocoder,
      defaultMarkGeocode: true,
    }).addTo(map);

    map.on("geocoder_showresult", function (e) {
      const latLng = e.result.center;
      setCoords({ lat: latLng.lat, lng: latLng.lng });
      map.setView([latLng.lat, latLng.lng], 13);
      document.getElementById(
        "coordinates"
      ).innerText = `Lat: ${latLng.lat.toFixed(4)}, Lng: ${latLng.lng.toFixed(
        4
      )}`;
    });

    map.on("click", function (e) {
      const latLng = e.latlng;

      VSetCoords({ lat: latLng.lat, lng: latLng.lng });
      document.getElementById(
        "coordinates"
      ).innerText = `Latitude: ${latLng.lat.toFixed(
        4
      )}, Longitude: ${latLng.lng.toFixed(4)}`;
    });

    return () => {
      map.off("click");
      map.off("geocoder_showresult");
      map.remove();
    };
  }, []);

  useEffect(() => {
    const fetchPreviousAddress = async () => {
      if (previousCoords) {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${previousCoords.lat}&lon=${previousCoords.lng}&format=json`
          );
          setPreviousAddress(response.data.display_name);
        } catch (error) {
          console.error("Error fetching previous address:", error);
        }
      }
    };

    fetchPreviousAddress();
  }, [previousCoords]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const map = mapInstance;

    if (!map) return;

    // Remove the previous marker from the map
    if (previousMarker) {
      map.removeLayer(previousMarker);
      setPreviousMarker(null); // Clear the previous marker reference
    }

    // Remove the previous circle from the map
    if (circle) {
      map.removeLayer(circle);
      setCircle(null); // Clear the previous circle reference
    }

    if (coords) {
      // Remove the previous tracker
      setTrackerKey((prevKey) => prevKey + 1);
    }

    if (inputLat && inputLng) {
      // Update map with coordinates
      const lat = parseFloat(inputLat);
      const lng = parseFloat(inputLng);
      setPreviousCoords(coords); // Save previous coordinates
      setCoords({ lat, lng });
      map.setView([lat, lng], 13);
      const newMarker = L.marker([lat, lng], { icon: blueMarkerIcon }) // Use the red marker icon here
        .addTo(map)
        .bindPopup("Coordinates")
        .openPopup();
      setPreviousMarker(newMarker); // Save new marker

      // Draw a circle with the specified radius
      const circleRadius = radius * 1000; // Convert km to meters
      const newCircle = L.circle([lat, lng], {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.1,
        radius: circleRadius,
      }).addTo(map);
      setCircle(newCircle); // Save new circle

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        setAddress(response.data.display_name);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    } else if (address) {
      // Update map with address
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
          )}&format=json`
        );

        const { lat, lon } = response.data[0];
        setPreviousCoords(coords); // Save previous coordinates
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        map.setView([lat, lon], 13);
        const newMarker = L.marker([lat, lon], { icon: blueMarkerIcon }) // Use the red marker icon here
          .addTo(map)
          .bindPopup(address)
          .openPopup();
        setPreviousMarker(newMarker); // Save new marker
        setInputLat(parseFloat(lat));
        setInputLng(parseFloat(lon));

        // Draw a circle with the specified radius
        const circleRadius = radius * 1000; // Convert km to meters
        const newCircle = L.circle([lat, lon], {
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.1,
          radius: circleRadius,
        }).addTo(map);
        setCircle(newCircle); // Save new circle
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    }
    const fetchSatelliteLocation = () => {
      fetch(
        "https://api.n2yo.com/rest/v1/satellite/positions/39084/47/39/0/2/?apiKey=KTL5EU-8LUF35-Y3H5GH-5BYE"
      )
        .then((response) => response.json())
        .then((data) => {
          const { satlatitude, satlongitude } = data.positions[0]; // Get coordinates

          // If marker doesn't exist, create it, otherwise update its position
          if (!markerRef.current) {
            markerRef.current = L.marker([satlatitude, satlongitude]).addTo(
              map
            );
          } else {
            markerRef.current.setLatLng([satlatitude, satlongitude]);
          }

          map.setView([satlatitude, satlongitude], map.getZoom()); // Update map center
        })
        .catch((error) =>
          console.error("Error fetching satellite data:", error)
        );
    };

    const fetchSatelliteData = async () => {
      try {
        const response = await axios.get(
          "https://api.n2yo.com/rest/v1/satellite/positions/39084/47/39/0/2/?apiKey=KTL5EU-8LUF35-Y3H5GH-5BYE"
        );
        const data = response.data;

        // Extract satellite information and position
        const satName = data.info.satname;
        const satId = data.info.satid;
        const satLat = data.positions[0].satlatitude;
        const satLon = data.positions[0].satlongitude;

        // Set the data into state variables
        setSatelliteName(satName);
        setSatelliteId(satId);
        setLatitude(satLat);
        setLongitude(satLon);
      } catch (error) {
        console.error("Error fetching satellite data:", error);
      }
    };

    useEffect(() => {
      const map = L.map("map").setView([51.505, -0.09], 13);

      satelliteData.forEach(({ lat, lng, id }) => {
        L.marker([lat, lng]).addTo(map).bindPopup(`Satellite ID: ${id}`);
      });
    }, [satelliteData]);

    useEffect(() => {
      // Check if the map instance already exists to avoid re-creating it
      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([0, 0], 2); // Default map view at [0,0], zoom level 2

        // Add a tile layer to the map (only once during the first render)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
      }

      // Fetch satellite data every 2 seconds, without affecting other map elements
      const intervalId = setInterval(() => {
        fetchSatelliteData(mapRef.current); // Pass the map instance for updating the satellite marker
      }, 2000);

      // Clean up the interval on unmount
      return () => {
        clearInterval(intervalId);
      };
    }, []);
  };

  return (
    <div>
      <div className="mb-40 flex flex-col lg:flex-row items-start lg:items-center p-4 space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex flex-col flex-[3] lg:w-1/2 space-y-4 sm: mx-auto w-[90vw]">
          <div>
            <h3 className="text-lg font-semibold">Previous Coordinates</h3>
            {previousCoords ? (
              <p>
                Latitude: {previousCoords.lat.toFixed(4)}, Longitude:{" "}
                {previousCoords.lng.toFixed(4)}
              </p>
            ) : (
              <p>No previous coordinates available.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Previous Address</h3>
            {previousAddress ? (
              <p>{previousAddress}</p>
            ) : (
              <p>No previous Address available.</p>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block">
                <input
                  type="radio"
                  name="locationType"
                  value="address"
                  checked={!inputLat && !inputLng}
                  onChange={() => {
                    setInputLat("");
                    setInputLng("");
                    setAddress("");
                  }}
                  className="mr-2"
                />
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block">
                <input
                  type="radio"
                  name="locationType"
                  value="coordinates"
                  checked={inputLat && inputLng}
                  onChange={() => {
                    setAddress("");
                  }}
                  className="mr-2"
                />
                Coordinates
              </label>
              <input
                type="number"
                value={inputLat}
                onChange={(e) => setInputLat(e.target.value)}
                placeholder="Latitude"
                step="0.0001"
                className="mt-2 p-2 border rounded w-full"
              />
              <input
                type="number"
                value={inputLng}
                onChange={(e) => setInputLng(e.target.value)}
                placeholder="Longitude"
                step="0.0001"
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block">Radius (km)</label>
              <input
                type="number"
                value={radius}
                min="0.5"
                max="500"
                step="0.1"
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="w-full lg:w-1/2 flex-[7]">
          <div id="map" className="h-[500px] w-full" ref={mapRef}></div>
          <p id="coordinates" className="mt-4 font-semibold">
            Click on the map or search for a location to get coordinates.
            <p className="text-red-700 font-bold ">
              This section is made to help you with the location on the map you
              select, This will not effect your tracking system
            </p>
          </p>
        </div>
        {/* <SatelliteContext map={mapInstance} userLocation={coords} /> */}
        <SatelliteContext
          radius={radius}
          userLocation={coords}
          notifyUser={true}
          map={mapInstance}
        />
        <LandsatContext.Provider
          value={{ lat: coords.lat, lng: coords.lng }}
        ></LandsatContext.Provider>
      </div>

      <Footer />
    </div>
  );
};

export default MapComponent;
