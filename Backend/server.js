const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const app = express();

//TODO: Verbinde eine Datenbank dazu

const db = new sqlite3.Database('./tasks.db');

app.use(bodyParser.json());   // Middleware

db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT 0)');


db.run('INSERT INTO tasks (title) VALUES (?)', "Zähne putzen");

//TODU: Schreibe request/responses


app.get('/', (req, res) => {
    res.send('request received');
});

app.get('/', (req, res) => {
    res.send('Vielen dank Sascha');
});
// wenn ein neues item hinzugefügt werden solll, soll NodeJS Server diesen Request so behandeln
app.post('/add', (req, res) => {
    db.run('INSERT INTO tasks (title) VALUES (?)', [req.body.title], function () {
    res.json({tag: "Mittwoch", bald_wirds: "Mittagspause"});
    });
});

// Liste mit alle existierenden Items
// hier sollte nur alle Items als json im Response geschrieben werden 
app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', function (err, rows){
        res.json(rows)

    })
});



app.listen(3050, "localhost", () => {
    console.log("bald ist Mittagspause")
});

// Test
//curl -X POST "http://localhost:3050/add" -H "Content-Type: application/json" -d '{ "title": "NodeJS lernen" }'