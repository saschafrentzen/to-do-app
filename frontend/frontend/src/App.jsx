import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Beim Laden der Seite Aufgaben abrufen
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  // Neue Aufgabe hinzufügen
  const itemHinzufügen = () => {
    if (!title.trim()) return; // Falls das Feld leer ist, nichts tun

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    .then((res) => res.json())
    .then((newTask) => setTasks([...tasks, newTask])); // Neue Aufgabe zur Liste hinzufügen

    setTitle(""); // Eingabefeld leeren
  };

  return (
    <>
      <h1>📝 TO-DO-Liste</h1>
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Neue Aufgabe eingeben..."
      />
      <button onClick={itemHinzufügen}>Hinzufügen</button>

      <ul>
        {tasks.map(({ id, title, completed }) => (
          <li key={id}>
            <input type="checkbox" defaultChecked={completed} /> {title}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
