import { useState, useEffect } from 'react';
import backgroundImage from "./assets/hintergrund.jpg";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  // Aufgaben von Backend laden
  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  // Neue Aufgabe hinzufügen
  const itemHinzufügen = () => {
    if (!title.trim()) return; // Falls das Eingabefeld leer ist, nichts tun

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    .then((res) => res.json())
    .then((newTask) => setTasks([...tasks, newTask])); // UI aktualisieren

    setTitle(""); // Eingabefeld nach dem Hinzufügen leeren
  };

  return (
    <div 
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <h1>📝 TO-DO-Liste</h1>
      <input 
        type="text"
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
    </div>
  );
  
  
}

export default App;

