require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mainRouter = require("./routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders:
      "Content-Type, Authorization, X-Requested-With, Accept, xsrf-token",
  })
);

app.use(express.json());

app.use(cookieParser());

app.use("/drive_files", express.static("public/drive_files"));

app.get("/", (req, res) => {
  res
    .status(200)
    .json({
      message:
        "Hello, W(-_(-_-)_-)E are Backing you Enjoy your journey in the Wonderland !",
    });
});

app.use("/api", mainRouter);

module.exports = app;
