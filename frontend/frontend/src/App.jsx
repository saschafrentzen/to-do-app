import React, { useState, useEffect } from "react";
import API_URL from "./config";
import backgroundImage from "./assets/hintergrund.jpeg";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Arbeit");
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/liste_abrufen`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        filterTasksByCategory(category, data);
      })
      .catch((error) => console.error("Fehler beim Laden der Aufgaben:", error));
  }, []);

  useEffect(() => {
    filterTasksByCategory(category, tasks);
  }, [tasks, category]);

  const itemHinzufügen = () => {
    if (!title.trim()) return;

    const newTask = { title, category, completed: false };

    fetch(`${API_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((addedTask) => {
        setTasks([...tasks, addedTask]);
      })
      .catch((error) => console.error("Fehler beim Hinzufügen der Aufgabe:", error));

    setTitle("");
  };

  const filterTasksByCategory = (selectedCategory, taskList = tasks) => {
    setCategory(selectedCategory);
    setFilteredTasks(taskList.filter((task) => task.category === selectedCategory));
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    fetch(`${API_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !tasks.find((task) => task.id === id).completed }),
    }).catch((error) => console.error("Fehler beim Aktualisieren der Aufgabe:", error));
  };

  const deleteTask = (id) => {
    fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error("Fehler beim Löschen der Aufgabe:", error));
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1>TO-DO-Liste</h1>

      <div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Neue Aufgabe eingeben..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
      </div>

      <ul>
        {filteredTasks.map(({ id, title, completed, category }) => (
          <li key={id}>
            <input type="checkbox" checked={completed} onChange={() => toggleTaskCompletion(id)} />
            {title} - <b>{category || "Keine Kategorie"}</b>
            {completed && <button onClick={() => deleteTask(id)}>Löschen</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
