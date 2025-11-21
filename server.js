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

  // Initialiser la position du joueur qui vient de se connecter
  // Ici on donne une position aléatoire simple pour éviter le chevauchement initial
  players[socket.id] = {
    x: Math.floor(Math.random() * 500),
    y: Math.floor(Math.random() * 500),
    id: socket.id,
    // tu peux ajouter : name, score, ready, team, etc.
  };

  // Envoyer l'état initial à tous les clients (nouveau + existants)
  io.emit("update", players);
  // Optionnel : informer le nouveau client de son propre id
  socket.emit("connected", { id: socket.id });

  // Écoute d'un événement 'move' envoyé par le client (déplacement)
  socket.on("move", (pos) => {
    // Mettre à jour la position du joueur côté serveur (validation possible ici)
    if (players[socket.id]) {
      // Exemple simple de validation : limiter les coordonnées au canvas 0..600/0..400
      players[socket.id].x = Math.max(0, Math.min(570, pos.x)); // 600 - largeur joueur (30)
      players[socket.id].y = Math.max(0, Math.min(570, pos.y)); // 400 - hauteur joueur (30)
    }
    // Broadcast : envoyer l'état mis à jour à tous les clients
    io.emit("update", players);
  });

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
