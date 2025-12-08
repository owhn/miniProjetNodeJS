const mysql = require("mysql2/promise");

let bdd;

async function connexion() {
    bdd = await mysql.createConnection({
        host: "10.187.52.4",
        user: "brissauda",
        password: "brissauda",
        database: "brissauda_b"
    });

    console.log("Base de données connectée !");
}

async function createUser(pseudo, mdp) {
    const [rows] = await bdd.execute(
        "INSERT INTO p4_joueurs (pseudo, password) VALUES (?, ?)",
        [pseudo, mdp]
    );
    const [rowsElo] = await bdd.execute(
        "INSERT INTO p4_elo (id_joueur) VALUES(?)",
        [rows.insertId]
    )
    return rows.insertId;
}

async function getUser(pseudo) {
    const [rows] = await bdd.execute(
        "SELECT * FROM p4_joueurs WHERE pseudo = ?",
        [pseudo]
    );
    //console.log(rows[0]);
    return rows[0];
}

async function loginUser(pseudo, mdp) {
    const user = await getUser(pseudo);
    if (!user) return { ok: false, msg: "Pseudo inconnu" };
    console.log(user.pseudo);
    if (user.password !== mdp) return { ok: false, msg: "Mot de passe incorrect" };

    let userID=user.id;
    return { ok: true, user, id: userID };
}

async function getElo(pseudo, mdp){
    const [rows] = await bdd.execute(
        "SELECT elo FROM p4_elo JOIN p4_joueurs ON p4_elo.id_joueur=p4_joueurs.id WHERE p4_joueurs.pseudo= ? AND p4_joueurs.password = ?",
        [pseudo,mdp]
    );
    return rows[0].elo;
}



module.exports = {
    connexion,
    createUser,
    getUser,
    loginUser,
    getElo
};