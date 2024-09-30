import React, { useState } from "react";

const NotificationForm = () => {
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [email, setEmail] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!longitude || !latitude || !email) {
      alert("Please fill in all fields.");
      return;
    }

    // Mock notification sending logic
    // In a real application, you'd make an API call to send the email
    console.log(
      `Sending notification to ${email} for coordinates (${latitude}, ${longitude})`
    );

    // Update notificationSent state to show feedback
    setNotificationSent(true);

    // Clear the form
    setLongitude("");
    setLatitude("");
    setEmail("");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Receive Satellite Notifications
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="latitude" className="text-lg font-medium mb-1">
            Latitude:
          </label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            step="any"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="longitude" className="text-lg font-medium mb-1">
            Longitude:
          </label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            step="any"
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-medium mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      {notificationSent && (
        <div className="mt-4 text-green-600">Form submitted successfully!</div>
      )}
    </div>
  );
};

export default NotificationForm;
