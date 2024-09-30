import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
<<<<<<< HEAD
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "KTL5EU-8LUF35-Y3H5GH-5BYE";

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const __dirname = path.resolve();

// MongoDB connection
=======
dotenv.config();

>>>>>>> b3f7f8eefd5197c69f36ad213f268b75aea55c52
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
<<<<<<< HEAD
    console.error("MongoDB connection error:", err);
  });

// Endpoint to fetch satellite positions
app.get("/satellite/:satId/:lat/:lng", async (req, res) => {
  const { satId, lat, lng } = req.params;

  try {
    const response = await axios.get(
      `https://api.n2yo.com/rest/v1/satellite/positions/${satId}/${lat}/${lng}/0/2/?apiKey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching satellite data:", error);
    res.status(500).send("Error fetching satellite data");
  }
});

// Static files and routes
app.use(express.static(path.join(__dirname, "/client/dist")));
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Catch-all route
=======
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

>>>>>>> b3f7f8eefd5197c69f36ad213f268b75aea55c52
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

<<<<<<< HEAD
// Global error handling middleware
=======
>>>>>>> b3f7f8eefd5197c69f36ad213f268b75aea55c52
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
<<<<<<< HEAD

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
=======
>>>>>>> b3f7f8eefd5197c69f36ad213f268b75aea55c52
