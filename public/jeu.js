const socket = io(); // connexion automatique au serveur
let joueurActif,numJoueur;

socket.on("tour",(joueur) =>{
    joueurActif=joueur;
    console.log("joueur actif :" + joueurActif);
});

socket.on("assignation",(num)=>{
    numJoueur=num;
});

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

socket.on("placement",(data) => {
    let idPos= data.idPos;
    let joueur=data.joueur;
    let div= document.getElementById(idPos);
    if (joueur===1) div.style.backgroundColor="red";
    else if (joueur===2) div.style.backgroundColor="yellow";

});

//afficher un message d'erreur quand la colonne est pleine
socket.on("colPleine",(colonne) =>{
    console.log("Colonne " + colonne + " pleine");
});
