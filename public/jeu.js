const socket = io(); // connexion automatique au serveur

let joueurActif,numJoueur,roomID;

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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
function colA(){
    if(joueurActif===numJoueur) socket.emit("choix", "A");
}
function colB(){
    if(joueurActif===numJoueur) socket.emit("choix", "B");
}
function colC(){
    if(joueurActif===numJoueur) socket.emit("choix", "C");
}
function colD(){
    if(joueurActif===numJoueur) socket.emit("choix", "D");
}
function colE(){
    if(joueurActif===numJoueur) socket.emit("choix", "E");
}
function colF(){
    if(joueurActif===numJoueur) socket.emit("choix", "F");
}
function colG(){
    if(joueurActif===numJoueur) socket.emit("choix", "G");
}

//on place les jetons avec les divs
socket.on("placement",(data) => {
    let idPos= data.idPos;
    let joueur=data.joueur;
=======
socket.on("roomJoined", (ID) => {
    roomID=ID;
    console.log("room : ", ID);
});

//on place les jetons avec les divs
socket.on("placement",(data) => {
=======
socket.on("roomJoined", (ID) => {
    roomID=ID;
    console.log("room : ", ID);
});

//on place les jetons avec les divs
socket.on("placement",(data) => {
>>>>>>> Stashed changes
    let idPos="";
    idPos= data.col + data.ligne; // ex : A6
    let joueur=data.player;

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    let div= document.getElementById(idPos);
    if (joueur===1) div.style.backgroundColor="red";
    else if (joueur===2) div.style.backgroundColor="yellow";

});

//afficher un message d'erreur quand la colonne est pleine
socket.on("colPleine",(colonne) =>{
    console.log("Colonne " + colonne + " pleine");
});

socket.on("victoire", (gagnant) => {
    console.log(gagnant + " gagne");
<<<<<<< Updated upstream
=======
    document.getElementById("zone-message").hidden=false;
>>>>>>> Stashed changes
    document.getElementById("txtCentre").textContent="joueur " + gagnant +" remporte la partie";
    if(gagnant===1) document.getElementById("zone-message").style.backgroundColor="red";
    else document.getElementById("zone-message").style.backgroundColor="yellow";
});

<<<<<<< Updated upstream
function clear(){
    socket.emit("clearServ",numJoueur);
    console.log("clear " + numJoueur);
}

socket.on("clearClient",(data)=>{
    console.log("clear client");
    document.getElementsByClassName("zone-jeton").style.backgroundColor="transparent";
});
=======


socket.on("clearClient",(data)=>{
    if(data===1 || data===2){
        document.getElementById("txtClear").textContent="joueur " + data + " a voté.";
    }
    else{
        let cases = document.getElementsByClassName("zone-jeton");
        document.getElementById("txtClear").textContent="";
        for (let c of cases) {
            c.style.backgroundColor = "transparent";
        }
        document.getElementById("zone-message").hidden = true;    
    }
});

function joinRoom(){
    socket.emit("joinRoom");
}

function recommencer(){
    console.log("clear " + numJoueur);
    socket.emit("clearServ", {vote: numJoueur, roomID});
}

function colChoix(col){
    if(joueurActif===numJoueur) socket.emit("choix", ({
        roomID,
        colonne : col,
        player: numJoueur
    }));
<<<<<<< Updated upstream
}
>>>>>>> Stashed changes
=======
}
>>>>>>> Stashed changes
