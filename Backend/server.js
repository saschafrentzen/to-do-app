const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3050;

// Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        console.error('❌ Fehler beim Öffnen der Datenbank:', err.message);
    } else {
        console.log('✅ Verbindung zur SQLite-Datenbank erfolgreich!');
    }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Tabelle erstellen (falls nicht vorhanden)
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT NOT NULL, 
    category TEXT NOT NULL, 
    completed INTEGER DEFAULT 0
  )
`, (err) => {
    if (err) {
        console.error("❌ Fehler beim Erstellen der Tabelle:", err.message);
    } else {
        console.log("✅ Datenbank-Tabelle 'tasks' bereit!");
    }
});

// 👉 Standardroute für Root-URL
app.get("/", (req, res) => {
    res.send("🚀 Backend läuft erfolgreich! API verfügbar unter /liste_abrufen, /add, /update/:id, /delete/:id");
});

// 🔍 Alle Aufgaben abrufen
app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Abrufen der Daten: " + err.message });
        }
        res.json(rows.map(task => ({
            ...task,
            completed: task.completed === 1 // Boolean korrekt setzen
        })));
    });
});

// ➕ Neue Aufgabe hinzufügen
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
                return res.status(500).json({ error: "Fehler beim Hinzufügen: " + err.message });
            }
            res.json({ id: this.lastID, title, category, completed: false });
        }
    );
});

// ✅ Aufgabe als erledigt markieren
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    db.run(
        'UPDATE tasks SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Fehler beim Aktualisieren: " + err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: "Aufgabe nicht gefunden!" });
            }
            res.json({ message: "Task erfolgreich aktualisiert!" });
        }
    );
});

// ❌ Aufgabe löschen
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Fehler beim Löschen: " + err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Aufgabe nicht gefunden!" });
        }
        res.json({ message: "Task erfolgreich gelöscht!" });
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

// Sicherstellen, dass die DB-Verbindung beim Beenden geschlossen wird
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('❌ Fehler beim Schließen der DB:', err.message);
        } else {
            console.log('📁 Datenbank-Verbindung geschlossen.');
        }
        process.exit();
    });
});
