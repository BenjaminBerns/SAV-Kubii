const fs = require('fs');
const path = require('path');

function Login(req, res)
{
    if(!req.body)
    {
        res.status(400).json({"message": "Erreur : Aucune données"});
        return;
    }
    
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        res.status(400).json({ "message": "Erreur : Username ou mot de passe manquant " });
    }

    let users = [];
    const fileData = fs.readFileSync('data/user.json', 'utf-8');
    users = JSON.parse(fileData);

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    if (user.password !== password) {
        return res.status(400).json({ message: "Mot de passe incorrect" });
    }


    let TokenGenerator = require( 'token-generator' )({
        salt: 'your secret ingredient for this magic recipe',
        timestampMap: 'TurKEY1234',
    });

    let token = TokenGenerator.generate();

    for (let i = 0; i < users.length; i++){
        if (user.username == users[i].username && user.password == users[i].password) {
            users[i].token = token;
        }
    }

    fs.writeFileSync('data/user.json', JSON.stringify(users), 'utf-8');

    if (user.username == username && password == user.password) {
        res.status(201).json({
            message: "Authentification réussi !",
            user: username,
            data:
            {
                token: token
            }
        });
    }
}

function Disconnect(req, res) {

    if(!req.body)
    {
        res.status(400).json({"message": "Erreur : Aucune données"});
        return;
    }

    const fileData = fs.readFileSync('data/user.json', 'utf-8');

    users = JSON.parse(fileData);

    const token = req.body.token;

    if (!token || token.trim() === '') {
        return res.status(400).json({ message: "Erreur : Token manquant ou invalide" });
    }

    const user = users.find(u => u.token === token);
    

    for (let i = 0; i < users.length; i++){
        if (user.token == users[i].token) {
            users[i].token = "";
        }
    }

    fs.writeFileSync('data/user.json', JSON.stringify(users), 'utf-8');

    res.status(201).json({
            message: "Déconnection réussi !",
            data:
            {
                user: user
            }
        });
    }

module.exports = { Login, Disconnect };