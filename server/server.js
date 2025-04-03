const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();
const userRoute = require("./routes/user");
const mfaRoute = require("./routes/mfa");
const adminRoute = require("./routes/admin");
const organizationRoute = require("./routes/organization");
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoute);
app.use("/api/mfa", mfaRoute);
app.use("/api/organization", organizationRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));