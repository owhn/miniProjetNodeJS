const express = require("express");
const {Server}=require("socket.io");
const http = require("http");

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let joueurs=[];
let votant=[];

<<<<<<< Updated upstream
=======
let rooms ={};

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


>>>>>>> Stashed changes
let tab = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];






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

    const numJoueur= rooms[roomID].players.length;

    socket.emit("assignation", numJoueur);
    socket.emit("roomJoined", (roomID));

    if(rooms[roomID].players.length===2){
      io.to(roomID).emit("tour", 1);
    }
  });

  socket.on("choix", ({roomID, colonne, player}) => {
    const room=rooms[roomID]; // on prend l'id de la room
    if(!room) return;
    let charCol = ['A','B','C','D','E','F','G'];
    let tab=room.board;
    if(player !== room.turn) return; // car pas son tour 

    for (let i = 5; i >= 0; i--) {
      if (tab[i][colonne] === 0) {
          tab[i][colonne] = player;
          io.to(roomID).emit("placement", { ligne: i+1, col : charCol[colonne], player });
          io.to(roomID).emit("tour",)
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

    
<<<<<<< Updated upstream
    socket.on("clearServ",(vote) => {
      votant.push[vote];
      if(votant[0]!==votant[votant.length()-1]){
        tab = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ];
        io.emit("clearClient",(null));
=======
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
>>>>>>> Stashed changes
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

    //boucles pour parcourir la matrice
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {

            //vérifier si la case appartient au joueur
            if (tab[r][c] !== joueur) continue;

            //Horizontal →
            if (c + 3 < COLS &&
                tab[r][c + 1] === joueur &&
                tab[r][c + 2] === joueur &&
                tab[r][c + 3] === joueur) {
                return true;
            }

            //Vertical ↓
            if (r + 3 < ROWS &&
                tab[r + 1][c] === joueur &&
                tab[r + 2][c] === joueur &&
                tab[r + 3][c] === joueur) {
                return true;
            }

            //Diagonale ↘
            if (r + 3 < ROWS && c + 3 < COLS &&
                tab[r + 1][c + 1] === joueur &&
                tab[r + 2][c + 2] === joueur &&
                tab[r + 3][c + 3] === joueur) {
                return true;
            }

            //Diagonale ↗
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


server.listen(PORT, () => {                
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});