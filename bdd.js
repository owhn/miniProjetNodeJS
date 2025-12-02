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
        "SELECT * FROM users WHERE pseudo = ?",
        [pseudo]
    );
    return rows[0];
}

async function loginUser(pseudo, mdp) {
    const user = await getUser(pseudo);
    if (!user) return { ok: false, msg: "Pseudo inconnu" };
    if (user.mdp !== mdp) return { ok: false, msg: "Mot de passe incorrect" };

    return { ok: true, user };
}



module.exports = {
    connexion,
    createUser,
    getUser,
    loginUser
};