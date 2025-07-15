const express = require("express");
const app = express();
const users = require("./users");

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.get("/", (req, res) => {
    res.json(
        {
            message : "Bienvenue sur l'API Kubii SAV",
            data : {}
        }
    );
});


app.post("/login", users.Login);
app.post("/Disconnect", users.Disconnect);


app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});