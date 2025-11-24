const express = require("express");
const {Server}=require("socket.io");
const http = require("http");

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let joueurs=[];

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
    socket.emit("erreur", "La partie est déjà pleine !");
    return;
  }
  joueurs.push(socket);
  let numJoueur=joueurs.length;
  socket.emit("assignation", numJoueur);

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
            if (joueurActif===1) joueurActif=2;
            else joueurActif=1;
            io.emit("tour", joueurActif);
            break;
          };
        }
        break;
    }; 
    
    
    
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
  




server.listen(PORT, () => {                
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});