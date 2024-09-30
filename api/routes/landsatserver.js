// satellite-api/index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000; // Use a different port for the satellite server
const API_KEY = "KTL5EU-8LUF35-Y3H5GH-5BYE"; // Your satellite API key

// Middleware to handle CORS
app.use(cors());

// Route to fetch satellite positions from N2YO API
app.get("/satellite/:satId/:lat/:lng", async (req, res) => {
  const { satId, lat, lng } = req.params;

  try {
    const response = await axios.get(
      `https://api.n2yo.com/rest/v1/satellite/positions/${satId}/${lat}/${lng}/0/2/?apiKey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching satellite data:", error);
    res.status(500).json({ error: "Error fetching satellite data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Satellite API server is running on port ${PORT}`);
});
