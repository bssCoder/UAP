const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoute = require("./routes/user");
const mfaRoute = require("./routes/mfa");
const adminRoute = require("./routes/admin");
const organizationRoute = require("./routes/organization");
const websiteRoute = require("./routes/website");

const app = express();

connectDB();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://uap-pi.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(require('cookie-parser')()); 

// Routes
app.use("/api/admin", adminRoute);
app.use("/api/mfa", mfaRoute);
app.use("/api/organization", organizationRoute);
app.use("/api/user", userRoute);
app.use("/api/website", websiteRoute);

const PORT = process.env.PORT || 7070;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} 🔥`));
