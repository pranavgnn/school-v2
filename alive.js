console.log("Alive code began running.");

const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(3000);
setInterval(() => {
  http.get(`http://school-v2.glitch.me/`);
}, 60000);