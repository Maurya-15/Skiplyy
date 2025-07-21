// server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import multer from "multer";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import businessRoutes from "./routes/businessRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";

dotenv.config();
connectDB();

// Create default admin user if not exists

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: "http://localhost:8085", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// ✅ Middleware
app.use(express.json());

// ✅ File Upload Setup
const __dirname = path.resolve(); // Needed when using ES Modules
const upload = multer({ dest: "uploads/" });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  const fileUrl = `http://localhost:5050${filePath}`;

  res.json({ url: fileUrl });
});

// ✅ API Routes
app.use("/api/auth", authRoutes); // Login/Register
app.use("/api/users", userRoutes); // Customer-specific routes
app.use("/api/businesses", businessRoutes); // Business-specific routes
app.use("/api/queues", queueRoutes); // Booking/Queue system

// ✅ Server Start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
