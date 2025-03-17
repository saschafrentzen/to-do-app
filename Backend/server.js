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
    title TEXT NOT NULL, 
    category TEXT NOT NULL, 
    completed INTEGER DEFAULT 0
  )
`);

// Alle Aufgaben abrufen
app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows.map(task => ({
            ...task,
            completed: task.completed === 1 // Boolean korrekt interpretieren
        })));
    });
});

// Aufgabe hinzufügen
app.post('/add', (req, res) => {
    const { title, category } = req.body;

    if (!title || !category) {
        return res.status(400).json({ error: "Title und Kategorie dürfen nicht leer sein!" });
    }

    db.run(
        'INSERT INTO tasks (title, category, completed) VALUES (?, ?, ?)',
        [title, category, 0],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, title, category, completed: false });
        }
    );
});

// Aufgabe als erledigt markieren
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    db.run(
        'UPDATE tasks SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: "Task updated successfully" });
        }
    );
});

// Aufgabe löschen
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: "Task deleted successfully" });
    });
});

// Server starten
app.listen(3050, () => {
    console.log("🚀 Server läuft auf http://localhost:3050");
});
