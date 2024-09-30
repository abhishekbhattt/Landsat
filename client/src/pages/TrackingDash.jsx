import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Circle,
  InfoWindow,
} from "@react-google-maps/api";
import { getDistance } from "geolib"; // For calculating distance
import emailjs from "@emailjs/browser"; // Import emailjs

const containerStyle = {
  width: "100%",
  height: "60vh",
  // comment
};

const blueMarkerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const GEOCODING_API_KEY = "YOUR_GEOCODING_API_KEY";
const DEFAULT_RADIUS = 500000; // 500 km in meters

const IssTracker = () => {
  const [isNightTime, setIsNightTime] = useState(false);
  const [isIssClose, setIsIssClose] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [userLat, setUserLat] = useState("");
  const [userLong, setUserLong] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [issPosition, setIssPosition] = useState({ lat: 0, lng: 0 });
  const [path, setPath] = useState([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [userLocationPosition, setUserLocationPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [prevUserLocationPosition, setPrevUserLocationPosition] =
    useState(null);
  const [address, setAddress] = useState("");
  const [distanceToIss, setDistanceToIss] = useState(0);
  const [arrivalTime, setArrivalTime] = useState("");
  const [wasPreviouslyInRange, setWasPreviouslyInRange] = useState(false);
  const form = useRef(); // Reference to the email form

  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux
  const userEmail = currentUser?.email;
  const userName = currentUser?.username; // Get the user's email
  // console.log(`${userEmail}  and ${userName}`);
  let checkRange = false;
  // Function to send an email via emailjs
  const sendEmailNotification = async () => {
    if (userEmail) {
      const emailParams = {
        to_email: userEmail,
        to_name: userName,
        message: "The ISS is within 500 km of your location!",
      };

      try {
        if (!checkRange) {
          await emailjs.send(
            "service_vzw8rsn", // Replace with your EmailJS service ID
            "template_pwur74l", // Replace with your EmailJS template ID
            emailParams,
            "0SDjTOB4zK7vrG5QG" // Replace with your EmailJS public key
          );
          // console.log(`SUCCESS! Email sent to ${userEmail}`);
          setEmailSent(true); // Ensure email is not sent repeatedly
          checkRange = true;
        }
      } catch (error) {
        // console.log("FAILED...", error.text);
      }
    }
  };

  const checkIssProximity = async () => {
    try {
      const response = await axios.get(
        "http://api.open-notify.org/iss-now.json"
      );
      const { latitude: issLat, longitude: issLong } =
        response.data.iss_position;

      setIssPosition({ lat: parseFloat(issLat), lng: parseFloat(issLong) });

      setPath((prevPath) => [
        ...prevPath,
        { lat: parseFloat(issLat), lng: parseFloat(issLong) },
      ]);

      const distance = getDistance(
        {
          latitude: userLocationPosition.lat,
          longitude: userLocationPosition.lng,
        },
        { latitude: issLat, longitude: issLong }
      );
      setDistanceToIss(distance);

      const issIsClose = distance > 0 && distance <= 500000; // within 500 km
      setIsIssClose(issIsClose);

      if (issIsClose && !emailSent) {
        sendEmailNotification();
        // Trigger the email when ISS is within range
      }

      if (!issIsClose) {
        checkRange = false;
        setEmailSent(false); // Reset emailSent when ISS is out of range
      }

      const timeToReach = (distance / 27000).toFixed(2);
      setArrivalTime(`${parseFloat(timeToReach).toFixed(2)} hours`);
    } catch (error) {
      console.error("Error fetching ISS data", error);
    }
  };
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(true); // Control pop-up visibility
  // useEffect to get the user's current location when the component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setShowPopup(false); // Close pop-up after obtaining location
        },
        (err) => {
          setError(err.message);
          setShowPopup(false); // Close pop-up is error
        }
      );

      // Cleanup the watcher on unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    setShowPopup(true); // Automatically show the pop-up
  }, []);

  const checkIfNight = async () => {
    try {
      const response = await axios.get("https://api.sunrise-sunset.org/json", {
        params: {
          lat: userLat || 0,
          lng: userLong || 0,
          formatted: 0,
        },
      });

      const { sunrise, sunset } = response.data.results;
      const sunriseHour = new Date(sunrise).getHours();
      const sunsetHour = new Date(sunset).getHours();
      const currentHour = new Date().getHours();

      const nightTime = currentHour >= sunsetHour || currentHour <= sunriseHour;
      setIsNightTime(nightTime);
    } catch (error) {
      console.error("Error fetching sunrise/sunset data", error);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${lat},${lng}`,
            key: GEOCODING_API_KEY,
          },
        }
      );
      const address =
        response.data.results[0]?.formatted_address || "Address not found";
      setAddress(address);
    } catch (error) {
      console.error("Error fetching address", error);
    }
  };

  const handleMapDblClick = useCallback(
    (e) => {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPrevUserLocationPosition(userLocationPosition);
      setUserLocationPosition(newPosition);
      fetchAddress(newPosition.lat, newPosition.lng);
      setUserLat(newPosition.lat);
      setUserLong(newPosition.lng);
    },
    [userLocationPosition]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      checkIssProximity();
    }, 2000);

    const nightCheckInterval = setInterval(() => {
      checkIfNight();
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(nightCheckInterval);
    };
  }, [userLocationPosition]);

  useEffect(() => {
    if (userLat && userLong) {
      setMapCenter({ lat: parseFloat(userLat), lng: parseFloat(userLong) });
    }
  }, [userLat, userLong]);

  const handleMarkerClick = useCallback(() => {
    setShowInfoWindow(true);
  }, []);

  const handleMapClick = useCallback(() => {
    setShowInfoWindow(false);
  }, []);

  return (
    <div className="mt-12 ml-3">
      <h1>ISS Tracker</h1>
      <div className="m-10px font-bold">
        <h2>Current Location</h2>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
          </div>
        )}
      </div>
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          setUserLocationPosition({
            lat: parseFloat(userLat),
            lng: parseFloat(userLong),
          });
          setMapCenter({ lat: parseFloat(userLat), lng: parseFloat(userLong) });
        }}
        className="space-y-4 mb-8"
      >
        <div>
          <label className="block text-lg font-semibold mb-2">
            Enter Latitude:
          </label>
          <input
            type="number"
            step="any"
            name="user_lat"
            value={userLat}
            onChange={(e) => setUserLat(e.target.value)}
            placeholder="Enter latitude..."
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">
            Enter Longitude:
          </label>
          <input
            type="number"
            step="any"
            name="user_long"
            value={userLong}
            onChange={(e) => setUserLong(e.target.value)}
            placeholder="Enter longitude..."
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Location
        </button>
      </form>

      <p>It is currently {isNightTime ? "night time" : "day time"}</p>
      <p>Distance to ISS: {distanceToIss} meters</p>
      <p>Arrival Time: {arrivalTime}</p>

      <LoadScript googleMapsApiKey="AIzaSyC3mZg6P7r2AzeOdm4XiQTmHora9Zs3fGQ">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={handleMapClick}
          onDblClick={handleMapDblClick}
        >
          <Marker position={userLocationPosition} label="User Location" />
          <Marker
            position={issPosition}
            icon={blueMarkerIcon}
            onClick={handleMarkerClick}
          />
          {showInfoWindow && (
            <InfoWindow position={issPosition}>
              <div>
                <h3>ISS Location</h3>
                <p>Lat: {issPosition.lat}</p>
                <p>Lng: {issPosition.lng}</p>
              </div>
            </InfoWindow>
          )}
          <Circle
            center={userLocationPosition}
            radius={DEFAULT_RADIUS}
            options={{
              fillColor: "lightblue",
              fillOpacity: 0.3,
              strokeColor: "blue",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default IssTracker;
