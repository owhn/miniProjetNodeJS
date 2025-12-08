<<<<<<< Updated upstream
const socket = io(); // connexion automatique au serveur

let joueurActif,numJoueur,roomID;

/////////////////////Mathys//////////////////////

let local = { x: 9, y: 0 }; // position locale (sera mise à jour par les flèches)
const playerSize = 113 ; // taille du carré représentant un joueur
=======
// jeu.js (client)
const socket = io();
>>>>>>> Stashed changes

let joueurActif = null;
let numJoueur = null;
let roomID = null;
let playerID = null; // id from DB if logged
let localPlayerId = null;

// canvas setup
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const playerSize = 113;

// basic theme images placeholders (you can keep your assets names)
const playerImgs1 = new Image(); playerImgs1.src = "sfspider.png";
const playerImgbk1 = new Image(); playerImgbk1.src = "kaarisr.png";
const playerImgbk2 = new Image(); playerImgbk2.src = "boobar.png";
const playerImgs2 = new Image(); playerImgs2.src = "venomr.png";
const playerImggf1 = new Image(); playerImggf1.src = "gfr.png";
const playerImggf2 = new Image(); playerImggf2.src = "pgfr.png";

// local position
let local = { x: 9, y: 0 };

// helpers
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

// socket events
socket.on("connect", () => { localPlayerId = socket.id; });

socket.on("assignation", (num) => { numJoueur = num; setText("menuStatus", "Tu es le joueur " + numJoueur); });

socket.on("roomJoined", (ID) => {
    roomID = ID;
    setText("roomIDinfo", ID);

    // Clear le plateau ici
    const cases = document.getElementsByClassName("zone-jeton");
    for (let c of cases) {
        c.classList.remove("rouge", "jaune", "kaaris", "booba", "gf", "pgf");
        c.style.backgroundColor = "";
    }
    document.getElementById("victoire").hidden = true;
});


socket.on("update", (players) => { draw(players); });

socket.on("placement", (data) => {
    const idPos = data.col + data.ligne;
    const joueur = data.player;
    const div = document.getElementById(idPos);
    if (!div) return;
    div.classList.remove("rouge", "jaune", "kaaris", "booba", "gf", "pgf");
    let theme = document.getElementById("themeSelect").value;
    if (theme === "spider") {
<<<<<<< Updated upstream
        if (joueur === 1) div.classList.add("rouge");
        else if (joueur === 2) div.classList.add("jaune");
    }
    else if (theme === "bk") {
        if (joueur === 1) div.classList.add("kaaris");
        else if (joueur === 2)div.classList.add("booba");
    }
    else if (theme === "gf") {
        if (joueur === 1) div.classList.add("gf");
        else if (joueur === 2)div.classList.add("pgf");
    }

=======
        div.style.backgroundColor = joueur === 1 ? "#e22525" : "#ffe600";
        div.classList.add(joueur === 1 ? "rouge" : "jaune");
    } else if (theme === "bk") {
        div.style.backgroundColor = joueur === 1 ? "#e22525" : "#ffe600";
        div.classList.add(joueur === 1 ? "kaaris" : "booba");
    } else {
        div.style.backgroundColor = joueur === 1 ? "#e22525" : "#ffe600";
        div.classList.add(joueur === 1 ? "gf" : "pgf");
    }
>>>>>>> Stashed changes
});

socket.on("colPleine", (col) => { setText("menuStatus", "Colonne " + col + " pleine"); });

<<<<<<< Updated upstream
socket.on("victoire", (gagnant) => {
    console.log(gagnant + " gagne");
    document.getElementById("victoire").hidden=false;
    document.getElementById("twin").textContent="joueur " + gagnant +" remporte la partie";
    /*if(gagnant===1) document.getElementById("victoire").style.backgroundColor="red";
    else document.getElementById("victoire").style.backgroundColor="yellow";*/
});
=======
socket.on("victoire", (data) => {
    document.getElementById("victoire").hidden = false;
>>>>>>> Stashed changes

    if (data === "abandon") {
        document.getElementById("twin").textContent = "Un joueur a abandonné";
        return;
    }

    const msg = data.pseudo
        ? `${data.pseudo} remporte la partie !`
        : `Joueur ${data.joueur} remporte la partie !`;

    document.getElementById("twin").textContent = msg;
});



socket.on("clearClient", (data) => {
    if (data === 1 || data === 2) {
        setText("txtClear", "Joueur " + data + " a voté");
    } else {
        // reset visuals
        const cases = document.getElementsByClassName("zone-jeton");
        for (let c of cases) {
            c.style.backgroundColor = "rgb(34, 33, 33)";
            c.classList.remove("rouge", "jaune", "kaaris", "booba", "gf", "pgf");
        }
<<<<<<< Updated upstream
        document.getElementById("zone-message").hidden = true;    
=======
        document.getElementById("victoire").hidden = true;
>>>>>>> Stashed changes
    }
});

socket.on("tour", (num) => { joueurActif = num; setText("menuStatus", "Tour: " + num); });

socket.on("queue_status", (s) => {
    if (s.status === "waiting_unranked") setText("unrankedStatus", "En attente (unranked)...");
    else if (s.status === "waiting_ranked") setText("rankedStatus", "En attente (ranked)...");
});

socket.on("elo_update", (d) => { setText("txtInfoLogin", "ELO mis à jour : " + d.newElo); });

socket.on("roomInfo", (data) => {
    setText("roomIDinfo", data.roomID || "-");
    setText("player1Name", data.p1 || "-");
    setText("player2Name", data.p2 || "-");
    setText("player1Elo", data.e1 || "-");
    setText("player2Elo", data.e2 || "-");
});

socket.on("privateRoomCreated", (code) => { setText("unrankedStatus", "Code: " + code); });
socket.on("privateRoomJoined", (code) => { setText("unrankedStatus", "Room privée rejointe: " + code); });

socket.on("register_ok", (d) => { setText("txtInfoLogin", "Compte créé id=" + d.id); });
socket.on("register_fail", (m) => { setText("txtInfoLogin", "Erreur: " + m); });

socket.on("login_ok", (d) => { playerID = d.id; setText("txtInfoLogin", "Connecté: " + (d.user ? d.user.pseudo : "ok") + " (ELO:" + d.elo + ")"); });
socket.on("login_fail", (m) => { setText("txtInfoLogin", m); });

socket.on("closedRoom", (m) => { setText("menuStatus", "Room fermée: " + m); roomID = null; numJoueur = null; });

/* ---------- UI functions ---------- */

function joinRandomUnranked() {
    socket.emit("joinUnrankedRandom");
}
function createPrivateRoom() {
    socket.emit("createPrivateRoom");
}
function joinPrivateRoom() {
    const code = document.getElementById("privateCode").value;
    if (!code) { setText("menuStatus", "Entrez un code"); return; }
    socket.emit("joinPrivateRoom", code);
}

function joinRanked() {
    if (!playerID) { setText("menuStatus", "Connecte-toi d'abord"); return; }
    socket.emit("joinRoom", { prevRoomID: roomID, playerID });
}

function setTheme(theme) {
    document.getElementById("themeSelect").value = theme;
}

let abandonCount = 0;
function abandon() {
    abandonCount++;
    if (abandonCount === 1) {
        setText("menuStatus", "Clique encore pour confirmer l'abandon");
        setTimeout(()=> abandonCount = 0, 2500);
        return;
    }
    if (abandonCount >= 2) {
        if (roomID) socket.emit("abandon", roomID);
        abandonCount = 0;
    }
}

function recommencer() {
    if (!roomID || !numJoueur) { setText("menuStatus", "Pas dans une room"); return; }
    socket.emit("clearServ", { vote: numJoueur, roomID });
}

function creerCompte() {
    const pseudo = document.getElementById("txtPseudo").value;
    const mdp = document.getElementById("txtMdp").value;
    console.log("Creating user with pseudo =", pseudo);
    socket.emit("register", { pseudo, mdp });
}

function loginCompte() {
    const pseudo = document.getElementById("txtPseudo").value;
    const mdp = document.getElementById("txtMdp").value;
    socket.emit("login", { pseudo, mdp });
}

/* keyboard & movement */
document.addEventListener("keydown", (e) => {
<<<<<<< Updated upstream
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
=======
    if (e.key === "ArrowLeft") { if (local.x > 9) local.x -= 116; }
    if (e.key === "ArrowRight") { if (local.x < 705) local.x += 116; }
    if (e.key === "Enter" || e.key === " ") {
        // map x to column
        switch(local.x){
            case 9: colChoix(0,9); break;
            case 125: colChoix(1,125); break;
            case 241: colChoix(2,241); break;
            case 357: colChoix(3,357); break;
            case 473: colChoix(4,473); break;
            case 589: colChoix(5,589); break;
            case 705: colChoix(6,705); break;
>>>>>>> Stashed changes
        }
    }
    socket.emit("move", { x: local.x, y: local.y, roomID });
});
<<<<<<< Updated upstream
/*//////////////////////////////////////////////////////////////////////////////////*/ 

function joinRoom(){
    socket.emit("joinRoom");
}

function recommencer(){
    console.log("clear " + numJoueur);
    socket.emit("clearServ", {vote: numJoueur, roomID});
}
=======
>>>>>>> Stashed changes

/* placement via UI (buttons) */
function colChoix(col,pos){
    if (joueurActif === numJoueur && roomID) {
        socket.emit("choix", ({ roomID, colonne: col, player: numJoueur }));
    }
    local.x = pos;
    socket.emit("move", { x: local.x, y: local.y, roomID });
}

<<<<<<< Updated upstream
/*FONTION RAJOUT2 PAR MATHYS
//////////////////////////////////////////////////////////////////////*/
var ttheme = document.getElementById("theme")

=======
/* draw function */
>>>>>>> Stashed changes
function draw(players) {
    if (!players) return;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for (const id in players) {
        const p = players[id];
        const isLocal = (id === localPlayerId);
        const joueur = p.playerNumber || 1;
        const radius = playerSize / 2;
        ctx.beginPath();
        ctx.arc(p.x + radius, p.y + radius, radius, 0, Math.PI*2);
        ctx.fillStyle = joueur === 1 ? "#e22525" : "#ffe600";
        ctx.fill();
        // draw image according to theme (optional)
        const theme = document.getElementById("themeSelect").value;
        if (theme === "bk") {
            if (joueur === 1) ctx.drawImage(playerImgbk1, p.x, p.y, playerSize, playerSize);
            else ctx.drawImage(playerImgbk2, p.x, p.y, playerSize, playerSize);
        } else if (theme === "spider") {
            ctx.drawImage(playerImgs1, p.x, p.y, playerSize, playerSize);
        } else if (theme === "gf") {
            if (joueur === 1) ctx.drawImage(playerImggf1, p.x, p.y, playerSize, playerSize);
            else ctx.drawImage(playerImggf2, p.x, p.y, playerSize, playerSize);
        }
        ctx.fillStyle = "black";
        ctx.font = "16px Fredoka, Arial";
        ctx.fillText(isLocal ? "Me" : id.slice(0,4), p.x, p.y - 6);
    }
}