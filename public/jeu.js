const socket = io(); // connexion automatique au serveur

let joueurActif,numJoueur,roomID,playerID;

/////////////////////Mathys//////////////////////

let local = { x: 9, y: 0 }; // position locale (sera mise à jour par les flèches)
const playerSize = 113 ; // taille du carré représentant un joueur

let localPlayerId = null;

// Récupérer le canvas et son contexte
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const playerImgs1 = new Image();
playerImgs1.src = "sfspider.png";

const playerImgbk1 = new Image();
playerImgbk1.src = "kaarisr.png";

const playerImgbk2 = new Image();
playerImgbk2.src = "boobar.png";

const playerImgs2 = new Image();
playerImgs2.src = "venomr.png";

const playerImggf1 = new Image();
playerImggf1.src = "gfr.png";

const playerImggf2 = new Image();
playerImggf2.src = "pgfr.png";

/////////////////////////////////////////////////////////

//après chaque placement, le serveur informe le client du de l'id du joueur pour qui c'est le tour
socket.on("tour",(joueur) =>{
    joueurActif=joueur;
    console.log("joueur actif :" + joueurActif);
});

//à la connexion du client, il récupère un ID assigné par le serveur
socket.on("assignation",(num)=>{
    numJoueur=num;
    console.log("mon id :" + numJoueur);
});

socket.on("roomJoined", (ID) => {
    roomID=ID;
    console.log("room : ", ID);
});

//on place les jetons avec les divs
socket.on("placement",(data) => {
    let idPos="";
    idPos= data.col + data.ligne; // ex : A6
    let joueur=data.player;


    let div= document.getElementById(idPos);

    div.classList.remove("rouge", "jaune", "kaaris", "booba", "gf", "pgf");

    let theme = document.getElementById("theme").value;

    if (theme === "spider") {
        if (joueur === 1) {
            div.style.backgroundColor="#e22525";
            div.classList.add("rouge");
        }
        else if (joueur === 2) {
            div.style.backgroundColor="#ffe600"
            div.classList.add("jaune");
        }
    }
    else if (theme === "bk") {
        if (joueur === 1) {
            div.style.backgroundColor="#e22525";
            div.classList.add("kaaris");
        }
        else if (joueur === 2){
            div.style.backgroundColor="#ffe600"
            div.classList.add("booba");
        }
    }
    else if (theme === "gf") {
        if (joueur === 1) {
            div.style.backgroundColor="#e22525";
            div.classList.add("gf");
        }
        else if (joueur === 2){
            div.style.backgroundColor="#ffe600"
            div.classList.add("pgf");
        }
    }

});

//afficher un message d'erreur quand la colonne est pleine
socket.on("colPleine",(colonne) =>{
    console.log("Colonne " + colonne + " pleine");
});

socket.on("victoire", (gagnant) => {
    console.log(gagnant + " gagne");
    document.getElementById("victoire").hidden=false;
    document.getElementById("twin").textContent="joueur " + gagnant +" remporte la partie";
});

socket.on("clearClient",(data)=>{
    if(data===1 || data===2){
        document.getElementById("txtClear").textContent="joueur " + data + " a voté.";
    }
    else{
        let cases = document.getElementsByClassName("zone-jeton");
        document.getElementById("txtClear").textContent="";
        for (let c of cases) {
            c.classList.remove("rouge", "jaune", "kaaris", "booba", "gf", "pgf");
            c.style.backgroundColor = "";
        }
        document.getElementById("victoire").hidden = true;    
    }
});

/*SOCKET RAJOUT2 PAR MATHYS
//////////////////////////////////////////////////////////////////////////////////*/
socket.on("connect", () => {
    localPlayerId = socket.id;
});

socket.on("update", (players) => {
    if (!localPlayerId) return; // on ignore tant qu'on n'a pas l'ID
    draw(players);
});

document.addEventListener("keydown", (e) => {
    // Modifier la position locale selon la touche pressée
    if (local.x > 9) if (e.key === "ArrowLeft") local.x -= 116;
    if (local.x < 705) if (e.key === "ArrowRight") local.x += 116;
  
    if (e.key === "Enter" || e.key === " "){
      switch(local.x){
        case 9:
            colChoix(0,9)
            break;
          case 125:
            colChoix(1,125)
            break;
          case 241:
            colChoix(2,241)
            break;
          case 357:
            colChoix(3,357)
            break;
          case 473:
            colChoix(4,473)
            break;
          case 589:
            colChoix(5,589)
            break;
          case 705:
            colChoix(6,705)
            break;
        }

    }
      
    // Envoyer immédiatement le déplacement au serveur
    socket.emit("move", { x: local.x, y: local.y , roomID: roomID});
});
/*//////////////////////////////////////////////////////////////////////////////////*/ 


    
function joinRoom(){
    if(roomID!==null) socket.emit("leaveRoom",(roomID));
    socket.emit("joinRoom",(roomID));
    let cases = document.getElementsByClassName("zone-jeton");
    document.getElementById("txtClear").textContent=" ";
    for (let c of cases) {
        c.style.backgroundColor = "rgb(34,33,33)";
    }
    document.getElementById("victoire").hidden = true;   
}

function leaveRoom(){
    socket.emit("leaveRoom",(roomID, playerID));
}

function creerCompte(){
    let pseudo=document.getElementById("txtPseudo").value;
    let mdp=document.getElementById("txtMdp").value;
    socket.emit("register", {pseudo, mdp});
}

function loginCompte(){
    let pseudo,mdp="";
    pseudo=document.getElementById("txtPseudo").value;
    mdp=document.getElementById("txtMdp").value;
    socket.emit("login", {pseudo, mdp});
}

socket.on("login_fail",(data)=>{
    document.getElementById("txtInfoLogin").textContent=data;
    console.log(data);
})

socket.on("login_ok",(data)=>{
    document.getElementById("txtInfoLogin").textContent=data;
    console.log(data);
    playerID=data.id;
    console.log("id: "+playerID);
})

socket.on("register_fail",(data)=>{
    document.getElementById("txtInfoLogin").textContent=data;
    console.log(data);
})

socket.on("register_ok",(data)=>{
    document.getElementById("txtInfoLogin").textContent=data;
    console.log(data);
})


function recommencer(){
    console.log("clear " + numJoueur);
    socket.emit("clearServ", {vote: numJoueur, roomID});
}

function colChoix(col,pos){
    if(joueurActif===numJoueur) socket.emit("choix", ({
        roomID,
        colonne : col,
        player: numJoueur
    }));
    local.x = pos;
    socket.emit("move", { x: local.x, y: local.y , roomID: roomID});
}

/*FONTION RAJOUTEE PAR MATHYS
//////////////////////////////////////////////////////////////////////*/
var ttheme = document.getElementById("theme")

function draw(players) {
    if (!players || Object.keys(players).length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const id in players) {

        const p = players[id];

        const isLocal = (id === localPlayerId);

        // !!!!! MODIFICATION ICI POUR PROBLEME DU NUMERO JOUEUR !!!!! //
        // Ancien code :
        // const joueur = isLocal ? numJoueur : (numJoueur === 1 ? 2 : 1);
        // Nouveau code : on récupère directement le playerNumber envoyé par le serveur
        const joueur = p.playerNumber; // <-- CHANGÉ ICI
        // !!!!! FIN MODIF PROBLEME NUMERO JOUEUR !!!!! //

        const radius = playerSize / 2;

        // Couleur
        if (joueur === 1) ctx.fillStyle = "#e22525";
        else ctx.fillStyle = "#ffe600";

        ctx.beginPath();
        ctx.arc(p.x + radius, p.y + radius, radius, 0, Math.PI * 2);
        ctx.fill();

        // Image
        if (ttheme.value == "bk") {
            if (joueur === 1) ctx.drawImage(playerImgbk1, p.x, p.y, playerSize, playerSize);
            else ctx.drawImage(playerImgbk2, p.x, p.y, playerSize, playerSize);
        }
        else if (ttheme.value == "spider") {
            if (joueur === 1) ctx.drawImage(playerImgs1, p.x, p.y, playerSize, playerSize);
            else ctx.drawImage(playerImgs1, p.x, p.y, playerSize, playerSize);
        }
        else if (ttheme.value == "gf") {
            if (joueur === 1) ctx.drawImage(playerImggf1, p.x, p.y, playerSize, playerSize);
            else ctx.drawImage(playerImggf2, p.x, p.y, playerSize, playerSize);
        }

        // ID
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(isLocal ? "Me" : id.slice(0, 4), p.x, p.y - 6);
    }
}
