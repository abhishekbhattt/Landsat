import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const IssTracker = () => {
  // Reference to the map container
  const mapContainer = useRef(null);
  let map = useRef(null); // Holds the map instance

  useEffect(() => {
    // Check if the map container exists
    if (mapContainer.current && !map.current) {
      // Initialize the map only once
      map.current = L.map(mapContainer.current).setView([51.505, -0.09], 13); // Default map center and zoom

      // Set the map tiles (you can choose your preferred tile provider)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map.current);

      // You can add any other map functionalities, such as markers
      // Example: Adding a marker
      const marker = L.marker([51.505, -0.09]).addTo(map.current);
      marker.bindPopup("<b>Hello!</b><br>This is your location.").openPopup();
    }

    // Clean up the map on component unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <h2>ISS Tracker</h2>
      {/* Map container - ensure the div is styled with height so the map is visible */}
      <div ref={mapContainer} style={{ height: "100vh", width: "100%" }} />
    </div>
  );
};

const TrackingDash = () => {
  return (
    <div>
      <h1>Tracking Dashboard</h1>
      <IssTracker />
    </div>
  );
};

export default TrackingDash;
