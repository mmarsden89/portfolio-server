require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

// create new express app and save it as "app"
const app = express();

// server configuration
const serverDevPort = 8080;
const clientDevPort = 3000;

// setting cors origin
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`,
  })
);

// set port to env for production or development
const PORT = process.env.PORT || serverDevPort;

// create a route for the app which gets the weather data
app.get("/", (req, res) => {
  const options = {
    host: "https://api.openweathermap.org",
    path: `/data/2.5/weather?q=Seattle&units=imperial&appid=${process.env.WEATHER_API}`,
    method: "GET",
  };

  const request = http.request(options, function (response) {
    let body = "";
    response.on("data", function (data) {
      body += data;
    });
    response.on("end", function () {
      res.send(JSON.parse(body));
    });
  });
  request.on("error", function (e) {
    console.log("Problem with request: " + e.message);
  });
  request.end();
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
