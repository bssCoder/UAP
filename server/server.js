const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoute = require("./routes/user");
const mfaRoute = require("./routes/mfa");
const adminRoute = require("./routes/admin");
const organizationRoute = require("./routes/organization");

const app = express();

// Connect to database
connectDB();

// CORS must come before route definitions
app.use(
  cors({
    origin: ["http://localhost:3000",
      "https://uap-pi.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/admin", adminRoute);
app.use("/api/mfa", mfaRoute);
app.use("/api/organization", organizationRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 7070;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} 🔥`));
