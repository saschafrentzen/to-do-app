import React, { useState, useEffect } from 'react';
import backgroundImage from './assets/hintergrund.jpeg'; // Bild importieren
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Arbeit");
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Aufgaben von Backend laden
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  // Neue Aufgabe hinzufügen
  const itemHinzufügen = () => {
    if (!title.trim()) return;

    const newTask = { title, category, completed: false };

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((addedTask) => {
        setTasks([...tasks, addedTask]); // Aufgabenliste aktualisieren
        setFilteredTasks([...filteredTasks, addedTask]); // Filterliste aktualisieren
      });

    setTitle(""); // Eingabefeld nach dem Hinzufügen leeren
  };

  // Aufgaben nach Kategorie filtern
  const filterTasksByCategory = (category) => {
    setCategory(category);
    setFilteredTasks(tasks.filter(task => task.category === category));
  };

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }} // Hintergrundbild über Inline-Stil
    >
      <h1>📝 TO-DO-Liste</h1>

      <div>
        <input
          type="text"   //fehler?
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Neue Aufgabe eingeben..."
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Arbeit">Arbeit</option>
          <option value="Einkaufen">Einkaufen</option>
          <option value="Privat">Privat</option>
        </select>

        <button onClick={itemHinzufügen}>Hinzufügen</button>
      </div>

      <div>
        <button onClick={() => filterTasksByCategory("Arbeit")}>Arbeit</button>
        <button onClick={() => filterTasksByCategory("Einkaufen")}>Einkaufen</button>
        <button onClick={() => filterTasksByCategory("Privat")}>Privat</button>
        <button onClick={() => setFilteredTasks(tasks)}>Alle Aufgaben</button>
      </div>

      <ul>
        {filteredTasks.map(({ id, title, completed, category }) => (
          <li key={id}>
            <input type="checkbox" defaultChecked={completed} /> 
            {title} - <b>{category}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
