// bdd.js
const mysql = require("mysql2/promise");

let bdd;

async function connexion() {
    if (bdd) return;
    bdd = await mysql.createConnection({
        host: "10.187.52.4", // adapte si besoin
        user: "brissauda",      // adapte si besoin
        password: "brissauda",      // adapte
        database: "brissauda_b"  // adapte
    });
    console.log("BDD connectée");
}

async function createUser(pseudo, mdp) {
    // vérifie l'existence
    const [exists] = await bdd.execute("SELECT id FROM p4_joueurs WHERE pseudo = ?", [pseudo]);
    if (exists.length > 0) throw { code: "ER_DUP_ENTRY" };

    const [res] = await bdd.execute("INSERT INTO p4_joueurs (pseudo, password) VALUES (?, ?)", [pseudo, mdp]);
    await bdd.execute("INSERT INTO p4_elo (id_joueur, elo) VALUES (?, ?)", [res.insertId, 500]);
    return res.insertId;
}

async function getUser(pseudo) {
    const [rows] = await bdd.execute("SELECT * FROM p4_joueurs WHERE pseudo = ?", [pseudo]);
    return rows[0];
}

async function loginUser(pseudo, mdp) {
    const user = await getUser(pseudo);
    if (!user) return { ok: false, msg: "Pseudo inconnu" };
    if (user.password !== mdp) return { ok: false, msg: "Mot de passe incorrect" };
    return { ok: true, user, id: user.id };
}

async function getEloById(id_joueur) {
    const [rows] = await bdd.execute("SELECT elo FROM p4_elo WHERE id_joueur = ?", [id_joueur]);
    if (!rows || rows.length === 0) return 500;
    return rows[0].elo;
}

async function updateElo(id_joueur, newElo) {
    await bdd.execute("UPDATE p4_elo SET elo = ? WHERE id_joueur = ?", [newElo, id_joueur]);
    return true;
}

module.exports = {
    connexion,
    createUser,
    getUser,
    loginUser,
    getEloById,
    updateElo
};
