import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";
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
};

const blueMarkerIcon =
  "https://img.icons8.com/?size=40&id=uRvqauJrCCGj&format=png&color=000000";
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
            "service_q1otemr", // Replace with your EmailJS service ID
            "template_qbojvsf ", // Replace with your EmailJS template ID
            emailParams,
            "DBMF9I3Jikp5Rmyjt" // Replace with your EmailJS public key
          );
          console.log(`SUCCESS! Email sent to ${userEmail}`);
          setEmailSent(true); // Ensure email is not sent repeatedly
          checkRange = true;
        }
      } catch (error) {
        console.log("FAILED...", error.text);
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
      setDistanceToIss((distance / 1000).toFixed(2));

      const issIsClose = distance > 0 && distance <= 500; // within 500 km
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
    <div>
      <div className="mt-12 ml-3 bg-gray-100 p-8 rounded-lg shadow-lg">
        {/* Title Section */}
        <h1 className="text-3xl font-bold mb-6 text-blue-700">ISS Tracker</h1>

        {/* Current Location Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Current Location
          </h2>
          {error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <div className="text-lg text-gray-700 space-y-2">
              <p>Latitude: {issPosition.lat}</p>
              <p>Longitude: {issPosition.lng}</p>
            </div>
          )}
        </div>

        {/* Form Section */}
        <form
          ref={form}
          onSubmit={(e) => {
            e.preventDefault();
            setUserLocationPosition({
              lat: parseFloat(userLat),
              lng: parseFloat(userLong),
            });
            setMapCenter({
              lat: parseFloat(userLat),
              lng: parseFloat(userLong),
            });
          }}
          className="space-y-6 mb-8 bg-white p-6 rounded-lg shadow"
        >
          {/* Latitude Input */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Enter Latitude:
            </label>
            <input
              type="number"
              step="any"
              name="user_lat"
              value={userLat}
              onChange={(e) => setUserLat(e.target.value)}
              placeholder="Enter latitude..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Longitude Input */}
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Enter Longitude:
            </label>
            <input
              type="number"
              step="any"
              name="user_long"
              value={userLong}
              onChange={(e) => setUserLong(e.target.value)}
              placeholder="Enter longitude..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Update Location
          </button>
        </form>

        {/* Time and Distance Information */}
        <div className="space-y-4">
          <p className="text-lg text-gray-800">
            It is currently{" "}
            <span className="font-semibold">
              {isNightTime ? "night time" : "day time"}
            </span>
          </p>
          <p className="text-lg text-gray-800">
            Distance to ISS:{" "}
            <span className="font-semibold">{distanceToIss} Kilometers</span>
          </p>
          <p className="text-lg text-gray-800">
            Arrival Time: <span className="font-semibold">{arrivalTime}</span>
          </p>
        </div>

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
      <Footer />
    </div>
  );
};

export default IssTracker;
