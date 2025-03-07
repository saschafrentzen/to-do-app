const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./tasks.db');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Datenbank-Tabelle erstellen (falls nicht vorhanden)
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    category TEXT, 
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
    const { title, category } = req.body;
    
    // Sicherstellen, dass der Titel und die Kategorie angegeben sind
    if (!title || !category) {
        return res.status(400).json({ error: "Title und Kategorie dürfen nicht leer sein!" });
    }

    // Aufgabe in die Datenbank einfügen
    db.run('INSERT INTO tasks (title, category, completed) VALUES (?, ?, ?)', [title, category, 0], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, title, category, completed: 0 });
    });
});

// Server starten
app.listen(3050, () => {
    console.log("🚀 Server läuft auf http://localhost:3050");
});
