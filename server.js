//Import libraries
var express = require("express");
//Create web server application
var app = express();


//The server port
var HTTP_PORT = process.env.PORT || 8080;

//To start server
app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

//The root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "Ok - Medical Records Server" });
});
