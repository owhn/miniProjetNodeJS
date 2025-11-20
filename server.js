const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // dossier qui contiendra ton html/js/css

io.on("connection", (socket) => {
  console.log("Un joueur s'est connecté :", socket.id);

  socket.on("disconnect", () => {
    console.log("Un joueur est parti :", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});
