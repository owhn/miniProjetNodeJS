const express = require("express"); 
const {Server}=require("socket.io");
const http = require("http");

const bdd = require("./bdd.js");

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let votant=[];

let joueurs = {}; // joueurs[roomID] = { socketId : {x, y, playerNumber} }

let rooms = {}; 

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





io.on("connection",(socket) =>  {
  console.log("client connecté :",socket.id);
  
  socket.on("register", async ({ pseudo, mdp }) => {
    try {
        const id = await bdd.createUser(pseudo, mdp);
        socket.emit("register_ok", id);
    } catch (e) {
        socket.emit("register_fail", "Pseudo déjà pris");
    }
  });

  socket.on("login", async ({ pseudo, mdp }) => {
    const result = await bdd.loginUser(pseudo, mdp);

    if (!result.ok) {
        socket.emit("login_fail", result.msg);
    } else {
        socket.emit("login_ok", result.user);
        let elo= await bdd.getElo(pseudo,mdp);
        console.log("pseudo : ", pseudo, " elo : ", elo);
    }
  });

  socket.on("leaveRoom",(closingRoomID)=>{
    delete rooms[closingRoomID];
    io.to(closingRoomID).emit("closedRoom",(closingRoomID + " fermée"));
  });

  socket.on("joinRoom", (prevID,playerID) => {
    let roomID = null;
    let baseElo,xPlayer1elo,xPlayer2elo;
    if(playerID===null){
      baseElo=500;
    }
    for (let id in rooms){
      if (rooms[id].players.length===1){
        if(playerID!==null) xPlayer2elo=await bdd.getElo(playerID);
        roomID=id;
        break;
      }
    }



    if(!roomID){
      roomID= "room" + Math.floor(Math.random()*100000);
      rooms[roomID] = {
        players: [],
        turn: 1,
        board: createEmptyBoard(),
        player1elo: playerElo;
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
    };
    
    io.to(pos.roomID).emit("update", joueurs[pos.roomID]);
  });

  ////////////////////////////////////////////////////////////////////////////
  socket.on("choix", ({roomID, colonne, player}) => {
    const room=rooms[roomID]; 
    if(!room) return;
    let charCol = ['A','B','C','D','E','F','G'];
    let tab=room.board;
    if(player !== room.turn) return; 

    for (let i = 5; i >= 0; i--) {
      if (tab[i][colonne] === 0) {
          tab[i][colonne] = player
          io.to(roomID).emit("placement", { ligne: i+1, col : charCol[colonne], player });
          io.to(roomID).emit("tour",room.turn)
          break;
      }
      else if (tab[0][colonne]!==0){
        socket.emit("colPleine",charCol[colonne]);
        io.to(roomID).emit("tour",room.turn)
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
        io.to(data.roomID).emit("tour", 1);
      }
      else {
        io.to(data.roomID).emit("clearClient", data.vote);
      };
    });
    
    for (let i=0;i<6;i++){
        let ligne ="";
        for (let j=0;j<7;j++){
          ligne += tab[i][j]+ " ";
        }
        console.log(ligne);
    }
    console.log("-------------");
  });

});

function checkWin(tab, joueur) {
    const ROWS = 6;
    const COLS = 7;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {

            if (tab[r][c] !== joueur) continue;

            // Horizontal →
            if (c + 3 < COLS &&
                tab[r][c + 1] === joueur &&
                tab[r][c + 2] === joueur &&
                tab[r][c + 3] === joueur) {
                return true;
            }

            // Vertical ↓
            if (r + 3 < ROWS &&
                tab[r + 1][c] === joueur &&
                tab[r + 2][c] === joueur &&
                tab[r + 3][c] === joueur) {
                return true;
            }

            // Diagonale ↘
            if (r + 3 < ROWS && c + 3 < COLS &&
                tab[r + 1][c + 1] === joueur &&
                tab[r + 2][c + 2] === joueur &&
                tab[r + 3][c + 3] === joueur) {
                return true;
            }

            // Diagonale ↗
            if (r - 3 >= 0 && c + 3 < COLS &&
                tab[r - 1][c + 1] === joueur &&
                tab[r - 2][c + 2] === joueur &&
                tab[r - 3][c + 3] === joueur) {
                return true;
            }
        }
    }
    return false;
}

(async () => {
  await bdd.connexion();

  server.listen(PORT, () => {
      console.log(`Serveur démarré : http://localhost:${PORT}`);
  });
})();