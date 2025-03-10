const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Verbindung zur SQLite-Datenbank herstellen (oder erstellen, falls nicht vorhanden)
const db = new sqlite3.Database('restaurant.db', (err) => {
    if (err) {
        console.error('Fehler beim Verbinden mit der Datenbank:', err.message);
    } else {
        console.log('Mit der SQLite-Datenbank verbunden.');
    }
});

// Tabelle erstellen, falls sie nicht existiert
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        description TEXT
    )`);
    
    // Lieblingsgerichte einfügen
    const dishes = [
        ['sushi', 'Ein leckerer Mix aus Sushi .'],
        ['pizza', 'Eine köstliche Pizza.'],
        ['taco', 'Ein herzhafter mexikanischer Mix.']
    ];
    
    dishes.forEach(([name, description]) => {
        db.run('INSERT OR IGNORE INTO menu (name, description) VALUES (?, ?)', [name, description]);
    });
});

// Routen für die Gerichte
app.get('/:dish', (req, res) => {
    const dish = req.params.dish;
    
    db.get('SELECT description FROM menu WHERE name = ?', [dish], (err, row) => {
        if (err) {
            res.status(500).send('Fehler bei der Datenbankabfrage.');
        } else if (row) {
            res.send(row.description);
        } else {
            res.status(404).send('Gericht nicht gefunden.');
        }
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
