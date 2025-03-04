const express = require('express');

const app = express();

//TODO: Verbinde eine Datenbank dazu

//TODU: Schreibe request/responses


app.get('/', (req, res) => {
    res.send('request received');
});

app.get('/', (req, res) => {
    res.send('Vielen dank Sascha');
});

app.listen(3050, "localhost", () => {
    console.log("bald ist Mittagspause")
});