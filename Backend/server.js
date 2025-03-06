const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./tasks.db');

app.use(bodyParser.json());
app.use(cors());

// Datenbank-Tabelle erstellen (falls nicht vorhanden)
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    completed BOOLEAN DEFAULT 0
  )
`);

// API-Endpunkte
app.get('/', (req, res) => {
    res.send('Server läuft!');
});

// Alle Aufgaben abrufen
app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Aufgabe hinzufügen
app.post('/add', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title darf nicht leer sein!" });
    }
    db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', [title, 0], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, title, completed: 0 });
    });
});

// Server starten
app.listen(3050, () => {
    console.log("🚀 Server läuft auf http://localhost:3050");
});
