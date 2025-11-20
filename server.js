// server.js
// Serveur Node + Express + Socket.io pour un jeu multijoueur simple

const express = require("express");         // framework web léger
const http = require("http");               // module http natif (nécessaire pour socket.io)
const { Server } = require("socket.io");    // socket.io côté serveur

const app = express();
const server = http.createServer(app);      // on attache express au serveur http
const io = new Server(server);              // on attache socket.io au serveur http

// Servir les fichiers statiques du dossier "public" (index.html, jeu.js, style.css)
app.use(express.static("public"));

// Objet pour stocker l'état des joueurs en mémoire (clé = socket.id)
const players = {}; // exemple: { socketId1: { x: 10, y: 20, name: "Alice" }, socketId2: {...} }

io.on("connection", (socket) => {
  // Nouveau client connecté
  console.log("Nouvelle connexion :", socket.id);

  let grid = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ];

  // Gérer la déconnexion
  socket.on("disconnect", () => {
    console.log("Déconnexion :", socket.id);
    // Supprimer le joueur de la liste
    delete players[socket.id];
    // Notifier les autres clients
    io.emit("update", players);
  });
});

// Démarrer le serveur sur le port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
