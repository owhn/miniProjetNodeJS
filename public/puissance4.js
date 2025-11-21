const socket = io(); // crée la connexion WebSocket vers le serveur

// Variables locales = état du joueur local
let localPlayerId = null; // id socket du joueur local (défini après 'connected')
let local = { x: 50, y: 50 }; // position locale (sera mise à jour par les flèches)
const playerSize = 30; // taille du carré représentant un joueur


// Récupérer le canvas et son contexte
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Quand le serveur nous confirme la connexion, il nous donne un id
socket.on("connected", (data) => {
  localPlayerId = data.id;
  console.log("Mon id :", localPlayerId);
});

// Quand on reçoit l'état mis à jour de tous les joueurs
// players est un objet { socketId: {x, y, id}, ...}
socket.on("update", (players) => {
  // Si notre joueur n'existe pas encore dans l'état serveur, l'ajouter
  if (!players[localPlayerId]) {
    // On n'envoie pas directement ici : on se contente d'afficher
    // Notre état local sera envoyé quand on bougera
  }
  // Dessiner l'état courant
  draw(players);
});


// Fonction pour dessiner tous les joueurs sur le canvas
function draw(players) {
  // Effacer le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Parcourir tous les joueurs reçus et les dessiner
  for (const id in players) {
    const p = players[id];

    // Choisir une couleur différente pour le joueur local
    if (id === localPlayerId) {
      ctx.fillStyle = "green"; // joueur local = vert
    } else {
      ctx.fillStyle = "blue";  // autres joueurs = bleu
    }
    ctx.fillRect(p.x, p.y, playerSize, playerSize);

    // Afficher l'ID ou un pseudo au-dessus du joueur (optionnel)
    ctx.fillStyle = "red";
    ctx.font = "12px Arial";
    ctx.fillText(id === localPlayerId ? "Moi" : id.slice(0, 4), p.x, p.y - 6);
  }
}
