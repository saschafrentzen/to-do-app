import React, { useState, useEffect } from 'react';
import backgroundImage from './assets/hintergrund.jpeg';
import './App.css';

function App() {
  // Zustände für Aufgabenliste, Eingabefelder und Filterung
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Arbeit");
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Aufgaben vom Server abrufen, wenn die Komponente geladen wird
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        filterTasksByCategory(category, data); // Sofort nach Kategorie filtern
      });
  }, []);

  // Aufgabenliste filtern, wenn sich die Kategorie ändert oder neue Aufgaben kommen
  useEffect(() => {
    filterTasksByCategory(category, tasks);
  }, [tasks, category]);

  // Neue Aufgabe hinzufügen
  const itemHinzufügen = () => {
    if (!title.trim()) return; // Verhindert das Hinzufügen leerer Aufgaben

    const newTask = { title, category, completed: false };

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((addedTask) => {
        const updatedTasks = [...tasks, addedTask];
        setTasks(updatedTasks);
        filterTasksByCategory(category, updatedTasks);
      });

    setTitle(""); // Eingabefeld leeren
  };

  // Aufgaben nach Kategorie filtern
  const filterTasksByCategory = (selectedCategory, taskList = tasks) => {
    setCategory(selectedCategory);
    setFilteredTasks(taskList.filter(task => task.category === selectedCategory));
  };

  // Aufgabe als erledigt/unerledigt markieren
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };

        // Update-Request an den Server senden
        fetch(`http://localhost:3050/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTask),
        });

        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    filterTasksByCategory(category, updatedTasks);
  };

  // Aufgabe löschen
  const deleteTask = (id) => {
    fetch(`http://localhost:3050/delete/${id}`, {
      method: "DELETE",
    }).then(() => {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      filterTasksByCategory(category, updatedTasks);
    });
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1> TO-DO-Liste</h1>

      {/* Eingabefeld und Kategorie-Auswahl */}
      <div>
        <input
          type="text"
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

      {/* Filterbuttons für Kategorien */}
      <div>
        <button onClick={() => filterTasksByCategory("Arbeit")}>Arbeit</button>
        <button onClick={() => filterTasksByCategory("Einkaufen")}>Einkaufen</button>
        <button onClick={() => filterTasksByCategory("Privat")}>Privat</button>
      </div>

      {/* Aufgabenliste */}
      <ul>
        {filteredTasks.map(({ id, title, completed, category }) => (
          <li key={id}>
            <input
              type="checkbox"
              checked={completed}
              onChange={() => toggleTaskCompletion(id)}
            />
            {title} - <b>{category || "Keine Kategorie"}</b>
            {completed && (
              <button onClick={() => deleteTask(id)}>Löschen</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
