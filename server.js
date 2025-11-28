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

let tab = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

let joueurActif = 1;

io.on("connection",(socket) =>  {
  console.log("client connecté :",socket.id);
  
  if (joueurs.length >= 2) {
    socket.emit("erreur", "La partie est déjà pleine");
    return;
  }

  joueurs.push(socket);
  let numJoueur=joueurs.length;
  socket.emit("assignation", numJoueur);
  socket.emit("tour", joueurActif);
  socket.on("choix", (colonne) => {
    switch (colonne){
      case 'A':
        for (let i = 5;i>=0;i--){
          if (tab[0][0]!==0){
            socket.emit("colPleine", "A");
            break;
          };
          if (tab[i][0]===0){
            let idPos="A"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][0]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
      case 'B':
        for (let i = 5;i>=0;i--){
          if (tab[0][1]!==0){
            socket.emit("colPleine", "B");
            break;
          };
          if (tab[i][1]===0){
            let idPos="B"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][1]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
      case 'C':
        for (let i = 5;i>=0;i--){
          if (tab[0][2]!==0){
            socket.emit("colPleine", "C");
            break;
          };
          if (tab[i][2]===0){
            let idPos="C"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][2]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
      case 'D':
        for (let i = 5;i>=0;i--){
          if (tab[0][3]!==0){
            socket.emit("colPleine", "D");
            break;
          };
          if (tab[i][3]===0){
            let idPos="D"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][3]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
      case 'E':
        for (let i = 5;i>=0;i--){
          if (tab[0][4]!==0){
            socket.emit("colPleine", "E");
            break;
          };
          if (tab[i][4]===0){
            let idPos="E"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][4]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
      case 'F':
        for (let i = 5;i>=0;i--){
          if (tab[0][5]!==0){
            socket.emit("colPleine", "F");
            break;
          };
          if (tab[i][5]===0){
            let idPos="F"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][5]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
      case 'G':
        for (let i = 5;i>=0;i--){
          if (tab[0][6]!==0){
            socket.emit("colPleine", "G");
            break;
          };
          if (tab[i][6]===0){
            let idPos="G"+(i+1);
            console.log(idPos);
            io.emit("placement", {idPos : idPos, joueur : joueurActif});
            tab[i][6]=joueurActif;
            if(checkWin(tab,joueurActif)) io.emit("victoire",joueurActif);
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
    }; 
    
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