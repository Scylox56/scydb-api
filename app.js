const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/error");
const { authLimiter, standardLimiter } = require("./middlewares/rateLimiter");

const app = express();

app.set("trust proxy", 1);

// the middlwares
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://scydb.netlify.app",
      "https://scydb-api.vercel.app",
    ],
    credentials: true,
  })
);
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// debug
app.get("/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      database: states[dbState],
      dbState: dbState,
      dbUri: process.env.DB_URI ? "Set" : "Not Set",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes with specific rate limiters
app.use("/api/v1/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/v1/movies", standardLimiter, require("./routes/movieRoutes"));
app.use("/api/v1/users", standardLimiter, require("./routes/userRoutes"));
app.use("/api/v1/roles", require("./routes/roleRoutes"));
app.use("/api/v1/genres", require("./routes/genreRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
