// server.js
const express = require("express");
const http = require("http");
<<<<<<< Updated upstream
=======
const { Server } = require("socket.io");
const bdd = require("./bdd");
>>>>>>> Stashed changes

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

/* ---------- In-memory structures ---------- */
let rooms = {}; // roomID -> { players: [{socketId, playerID, elo, pseudo}], board, turn, votes, ranked }
let matchQueue = []; // ranked queue entries { socketId, playerID, elo, requestedAt }
let unrankedQueue = []; // socketId[]
let privateRooms = {}; // code -> socketId (waiting) or roomID during match

/* ---------- ELO helpers ---------- */
const K = 32;
function expectedScore(a, b) {
    return 1 / (1 + Math.pow(10, (b - a)/400));
}
function computeElo(a, b, scoreA) {
    const exp = expectedScore(a, b);
    return Math.round(a + K * (scoreA - exp));
}

<<<<<<< Updated upstream
io.on("connection",(socket) =>  {
  console.log("client connecté :",socket.id);
  
  socket.on("joinRoom", () => {
    let roomID = null;

    for (let id in rooms){
      if (rooms[id].players.length===1){
        roomID=id;
        break;
      };
    }

    if(!roomID){
      roomID= "room" + Math.floor(Math.random()*100000);
      rooms[roomID] = {
        players: [],
        turn: 1,
        board: createEmptyBoard()
      };
    }

    socket.join(roomID);
    rooms[roomID].players.push(socket.id);

    ///////////////////////////////

    // Calculer le playerNumber
    const playerNumber = rooms[roomID].players.length; // 1 ou 2

    // Initialiser la position du joueur dans l'objet joueurs avec playerNumber
    if (!joueurs[roomID]) joueurs[roomID] = {};
    joueurs[roomID][socket.id] = { x: 9, y: 0, playerNumber }; // <-- AJOUT playerNumber

    // Envoyer la position initiale à tous les joueurs de la room
    io.to(roomID).emit("update", joueurs[roomID]);

    ///////////////////////////////

    socket.emit("assignation", playerNumber);
    socket.emit("roomJoined", roomID);

    if(rooms[roomID].players.length===2){
      io.to(roomID).emit("tour", 1);
    }
  });

  ////////////////////////////////////////////////////////////////////////
  // Déplacement Mathys

  socket.on("move", (pos) => {
    if (!joueurs[pos.roomID]) joueurs[pos.roomID] = {};

    // Conserver playerNumber même après déplacement
    const playerNumber = joueurs[pos.roomID][socket.id]?.playerNumber || 1;

    joueurs[pos.roomID][socket.id] = {
        x: Math.max(9, Math.min(705, pos.x)),
        y: 0,
        playerNumber // <-- AJOUT playerNumber
=======
/* ---------- Board helper ---------- */
function createEmptyBoard() {
    return [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];
}

/* ---------- Room creation util ---------- */
function createRoomFromSockets(s1, s2, ranked = false, p1 = {}, p2 = {}) {
    const roomID = "room" + Math.floor(Math.random()*999999);
    rooms[roomID] = {
        players: [
            { socketId: s1.id, playerID: p1.playerID || null, elo: p1.elo || 500, pseudo: p1.pseudo || "Invité" },
            { socketId: s2.id, playerID: p2.playerID || null, elo: p2.elo || 500, pseudo: p2.pseudo || "Invité" }
        ],
        board: createEmptyBoard(),
        turn: Math.random() < 0.5 ? 1 : 2,
        votes: new Set(),
        ranked: !!ranked
>>>>>>> Stashed changes
    };

    // sockets join
    s1.join(roomID);
    s2.join(roomID);

<<<<<<< Updated upstream
    for (let i = 5; i >= 0; i--) {
      if (tab[i][colonne] === 0) {
          tab[i][colonne] = player
          io.to(roomID).emit("placement", { ligne: i+1, col : charCol[colonne], player });
          break;
      }
      else if (tab[0][colonne]!==0){
        socket.emit("colPleine",charCol[colonne]);
      };
    }

    if(checkWin(tab, player)) {
      io.to(roomID).emit("victoire", player);
      return;
    }

    if(room.turn===1) room.turn=2;
    else room.turn=1;
    io.to(roomID).emit("tour", room.turn);

    socket.on("clearServ",(data) => {
      votant.push(data.vote);
      if (votant[0]!==votant[votant.length-1]) {
        rooms[roomID].board=createEmptyBoard();
        rooms[roomID].turn=1;
        votant=[];
        data.vote=0;
        io.to(data.roomID).emit("clearClient", data.vote);
        io.to(roomID).emit("tour", 1);
      }
      else {
        io.to(data.roomID).emit("clearClient", data.vote);
      };
=======
    // assign numbers and notify
    io.to(s1.id).emit("assignation", 1);
    io.to(s2.id).emit("assignation", 2);

    io.to(roomID).emit("roomJoined", roomID);
    io.to(roomID).emit("roomInfo", {
        roomID,
        p1: rooms[roomID].players[0].pseudo,
        p2: rooms[roomID].players[1].pseudo,
        e1: rooms[roomID].players[0].elo,
        e2: rooms[roomID].players[1].elo
>>>>>>> Stashed changes
    });

    // initial positions for client draw (simple)
    const joueursMap = {};
    joueursMap[s1.id] = { x: 9, y: 0, playerNumber: 1, playerID: p1.playerID || null };
    joueursMap[s2.id] = { x: 705, y: 0, playerNumber: 2, playerID: p2.playerID || null };
    io.to(roomID).emit("update", joueursMap);

    io.to(roomID).emit("tour",  rooms[roomID].turn);

    console.log("Created room", roomID, "players:", s1.id, s2.id);
    return roomID;
}

/* ---------- Match-finding helper (avoid self match) ---------- */
function findMatchIndexFor(elo, requesterSocketId, tryWindow = 200) {
    for (let i = 0; i < matchQueue.length; i++) {
        const q = matchQueue[i];
        if (q.socketId === requesterSocketId) continue;
        if (Math.abs(q.elo - elo) <= tryWindow) return i;
    }
    return -1;
}

/* ---------- Socket handling ---------- */
io.on("connection", (socket) => {
    console.log("connect", socket.id);

    /* ---------- AUTH: register/login ---------- */
    socket.on("register", async ({ pseudo, mdp }) => {
        try {
            if (!pseudo || !pseudo.trim() || pseudo.length < 3) {
                socket.emit("register_fail", "Pseudo invalide (>=3 chars)");
                return;
            }
            const id = await bdd.createUser(pseudo.trim(), mdp || "");
            socket.emit("register_ok", { id });
        } catch (e) {
            if (e && e.code === "ER_DUP_ENTRY") {
                socket.emit("register_fail", "Pseudo déjà pris");
            } else {
                console.error("register error", e);
                socket.emit("register_fail", "Erreur serveur");
            }
        }
    });

    socket.on("login", async ({ pseudo, mdp }) => {
        try {
            const res = await bdd.loginUser(pseudo, mdp);
            if (!res.ok) {
                socket.emit("login_fail", res.msg);
            } else {
                const elo = await bdd.getEloById(res.id);
                socket.emit("login_ok", { user: res.user, id: res.id, elo });
                // store minimal mapping on socket for quick access
                socket.data.playerID = res.id;
                socket.data.pseudo = res.user.pseudo;
                socket.data.elo = elo;
            }
        } catch (e) {
            console.error("login error", e);
            socket.emit("login_fail", "Erreur serveur");
        }
    });

    /* ---------- LEAVE / DISCONNECT ---------- */
    socket.on("leaveRoom", (roomID) => {
        if (!roomID) return;
        socket.leave(roomID);
        if (rooms[roomID]) {
            rooms[roomID].players = rooms[roomID].players.filter(p => p.socketId !== socket.id);
            io.to(roomID).emit("roomInfo", {
                roomID,
                p1: rooms[roomID].players[0] ? rooms[roomID].players[0].pseudo : "-",
                p2: rooms[roomID].players[1] ? rooms[roomID].players[1].pseudo : "-"
            });
            if (rooms[roomID].players.length === 0) {
                delete rooms[roomID];
            } else {
                io.to(roomID).emit("closedRoom", "player_left");
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("disconnect", socket.id);
        // remove from ranked queue
        matchQueue = matchQueue.filter(q => q.socketId !== socket.id);
        // remove from unranked queue
        unrankedQueue = unrankedQueue.filter(sid => sid !== socket.id);
        // if waiting in privateRooms, remove
        for (const code in privateRooms) {
            if (privateRooms[code] === socket.id) delete privateRooms[code];
        }
        // if in a room, notify and delete room
        for (const r in rooms) {
            const idx = rooms[r].players.findIndex(p => p.socketId === socket.id);
            if (idx !== -1) {
                rooms[r].players.splice(idx, 1);
                io.to(r).emit("closedRoom", "opponent_left");
                delete rooms[r];
                break;
            }
        }
    });

    /* ---------- UNRANKED RANDOM ---------- */
    socket.on("joinUnrankedRandom", () => {
        // if queue empty push
        const otherId = unrankedQueue.find(id => id !== socket.id);
        if (!otherId) {
            unrankedQueue.push(socket.id);
            socket.emit("queue_status", { status: "waiting_unranked" });
            return;
        }
        // match
        unrankedQueue = unrankedQueue.filter(id => id !== socket.id && id !== otherId);
        const otherSocket = io.sockets.sockets.get(otherId);
        createRoomFromSockets(socket, otherSocket, false, { pseudo: socket.data.pseudo, elo: socket.data.elo, playerID: socket.data.playerID }, { pseudo: otherSocket.data.pseudo, elo: otherSocket.data.elo, playerID: otherSocket.data.playerID });
    });

    /* ---------- PRIVATE ROOMS ---------- */
    socket.on("createPrivateRoom", () => {
        const code = Math.floor(10000 + Math.random()*90000).toString();
        privateRooms[code] = socket.id;
        socket.emit("privateRoomCreated", code);
    });

    socket.on("joinPrivateRoom", (code) => {
        if (!code) {
            socket.emit("menu_msg", "Code invalide");
            return;
        }
        const waiting = privateRooms[code];
        if (!waiting) {
            // be the first
            privateRooms[code] = socket.id;
            socket.emit("menu_msg", "Code créé localement, en attente d'un ami");
            return;
        }
        if (waiting === socket.id) {
            socket.emit("menu_msg", "Tu as déjà créé ce code");
            return;
        }
        // create room with waiting socket
        const otherSocket = io.sockets.sockets.get(waiting);
        if (!otherSocket) {
            delete privateRooms[code];
            socket.emit("menu_msg", "Code invalide");
            return;
        }
        createRoomFromSockets(socket, otherSocket, false, { pseudo: socket.data.pseudo, elo: socket.data.elo, playerID: socket.data.playerID }, { pseudo: otherSocket.data.pseudo, elo: otherSocket.data.elo, playerID: otherSocket.data.playerID });
        delete privateRooms[code];
        socket.emit("privateRoomJoined", code);
        otherSocket.emit("privateRoomJoined", code);
    });

    /* ---------- RANKED MATCHMAKING ---------- */
    socket.on("joinRoom", async ({ prevRoomID, playerID }) => {
        try {
            // cleanup prevRoom
            if (prevRoomID) {
                socket.leave(prevRoomID);
                if (rooms[prevRoomID]) {
                    rooms[prevRoomID].players = rooms[prevRoomID].players.filter(p => p.socketId !== socket.id);
                    if (rooms[prevRoomID].players.length === 0) delete rooms[prevRoomID];
                    else io.to(prevRoomID).emit("closedRoom", "player_left");
                }
            }

            // get elo
            let elo = 500;
            if (playerID) {
                try { elo = await bdd.getEloById(playerID) || 500; } catch (e) { elo = 500; }
            } else if (socket.data.elo) elo = socket.data.elo;

            // add to queue
            const entry = { socketId: socket.id, playerID: playerID || socket.data.playerID || null, elo, requestedAt: Date.now() };
            matchQueue.push(entry);
            socket.emit("queue_status", { status: "waiting_ranked" });

            // try find opponent within window
            let idx = findMatchIndexFor(elo, socket.id, 200);
            if (idx === -1) idx = matchQueue.findIndex(q => q.socketId !== socket.id);

            if (idx !== -1) {
                const opp = matchQueue[idx];
                if (!opp || opp.socketId === socket.id) return;
                // remove both
                matchQueue = matchQueue.filter(q => q.socketId !== socket.id && q.socketId !== opp.socketId);
                const otherSocket = io.sockets.sockets.get(opp.socketId);

                // obtain pseudos and elos if available
                const p1 = { playerID: entry.playerID, elo: entry.elo, pseudo: socket.data.pseudo || "Invité" };
                const p2 = { playerID: opp.playerID, elo: opp.elo, pseudo: otherSocket ? (otherSocket.data.pseudo || "Invité") : "Invité" };

                createRoomFromSockets(socket, otherSocket, true, p1, p2);
            }
        } catch (e) {
            console.error("joinRoom error", e);
        }
    });

    /* ---------- MOVEMENT ---------- */
    socket.on("move", ({ x, y, roomID }) => {
        if (!roomID) return;
        // broadcast minimal movement map to room
        const map = {};
        map[socket.id] = { x: Math.max(9, Math.min(705, x)), y: 0, playerNumber: (rooms[roomID] && rooms[roomID].players.find(p => p.socketId === socket.id) ? (rooms[roomID].players.find(p => p.socketId === socket.id) === rooms[roomID].players[0] ? 1 : 2) : 1), playerID: socket.data.playerID || null };
        io.to(roomID).emit("update", map);
    });

    /* ---------- CHOIX / PLACEMENT ---------- */
    socket.on("choix", async ({ roomID, colonne, player }) => {
        const room = rooms[roomID];
        if (!room) return;
        if (player !== room.turn) return;

        const charCol = ['A','B','C','D','E','F','G'];
        const tab = room.board;

        for (let i = 5; i >= 0; i--) {
            if (tab[i][colonne] === 0) {
                tab[i][colonne] = player;
                io.to(roomID).emit("placement", { ligne: i+1, col: charCol[colonne], player });
                break;
            } else if (i === 0) {
                io.to(socket.id).emit("colPleine", charCol[colonne]);
                io.to(roomID).emit("tour", room.turn);
                return;
            }
        }

        // check win
        if (checkWin(tab, player)) {
            const gagnantData = room.players[player-1]; // player=1 → index 0, player=2 → index 1
            io.to(roomID).emit("victoire", { joueur: player, pseudo: gagnantData.pseudo });
          

            // update elo if ranked and both have playerID
            const winnerIdx = player === 1 ? 0 : 1;
            const loserIdx = 1 - winnerIdx;
            const winner = room.players[winnerIdx];
            const loser = room.players[loserIdx];

            (async () => {
                try {
                    if (room.ranked && winner.playerID && loser.playerID) {
                        const eloW = await bdd.getEloById(winner.playerID);
                        const eloL = await bdd.getEloById(loser.playerID);
                        const newW = computeElo(eloW, eloL, 1);
                        const newL = computeElo(eloL, eloW, 0);
                        await bdd.updateElo(winner.playerID, newW);
                        await bdd.updateElo(loser.playerID, newL);

                        // notify
                        io.to(winner.socketId).emit("elo_update", { newElo: newW });
                        io.to(loser.socketId).emit("elo_update", { newElo: newL });
                    }
                } catch (e) { console.error("ELO update error", e); }
            })();

            delete rooms[roomID];
            return;
        }

        // switch turn
        room.turn = room.turn === 1 ? 2 : 1;
        io.to(roomID).emit("tour", room.turn);
    });

    /* ---------- CLEAR / RESET (vote) ---------- */
    socket.on("clearServ", ({ vote, roomID }) => {
        const room = rooms[roomID];
        if (!room) return;
        if (!room.votes) room.votes = new Set();
        room.votes.add(vote);
        if (room.votes.has(1) && room.votes.has(2)) {
            room.board = createEmptyBoard();
            room.turn = 1;
            room.votes = new Set();
            io.to(roomID).emit("clearClient", 0);
            io.to(roomID).emit("tour",  rooms[roomID].turn);
        } else {
            io.to(roomID).emit("clearClient", vote);
        }
    });

    /* ---------- ABANDON ---------- */
    socket.on("abandon", (roomID) => {
        if (!rooms[roomID]) return;
        // the other wins
        io.to(roomID).emit("victoire", "abandon");
        delete rooms[roomID];
    });

    /* ---------- small admin / debug ---------- */
    socket.on("pingServer", () => socket.emit("pong"));

}); // end io.on

/* ---------- checkWin algorithm ---------- */
function checkWin(tab, joueur) {
    const ROWS = 6, COLS = 7;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (tab[r][c] !== joueur) continue;
            // horizontal
            if (c + 3 < COLS && tab[r][c+1] === joueur && tab[r][c+2] === joueur && tab[r][c+3] === joueur) return true;
            // vertical
            if (r + 3 < ROWS && tab[r+1][c] === joueur && tab[r+2][c] === joueur && tab[r+3][c] === joueur) return true;
            // diag down-right
            if (r + 3 < ROWS && c + 3 < COLS && tab[r+1][c+1] === joueur && tab[r+2][c+2] === joueur && tab[r+3][c+3] === joueur) return true;
            // diag up-right
            if (r - 3 >= 0 && c + 3 < COLS && tab[r-1][c+1] === joueur && tab[r-2][c+2] === joueur && tab[r-3][c+3] === joueur) return true;
        }
    }
    return false;
}

<<<<<<< Updated upstream
server.listen(PORT, () => {                
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
=======
/* ---------- start ---------- */
(async () => {
    await bdd.connexion();
    server.listen(PORT, () => console.log(`Serveur démarré : http://localhost:${PORT}`));
})();
>>>>>>> Stashed changes
