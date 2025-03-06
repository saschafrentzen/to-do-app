import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:3050/liste_abrufen")
    .then((res) => res.json())
    .then(setTasks);
  }, []);

  const itemHinzufügen = () => {

    fetch("http://localhost:3050/add", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title}),
    })
    .then(() => fetch("http://localhost:3050/liste_abrufen"))
    .then((res) => res.json())
    .then(setTasks);

  setTitle(""); 
  };

  console.log(tasks)

  return (
    <>
    <h1>TO-DO-Liste</h1>
    <input value={title}
    onChange={(e) => setTitle(e.target.value)} 
    />
    <button onClick={itemHinzufügen} >Add</button>
    <ul>
      {// hier gehört der code , um die To-Do-Liste dynamisch zu gestalten
     tasks.map(({ id, title, completed }) => (
      <li key={id}>
        <input type='checkbox' /> {title} {completed}
      </li>
    ))

      }


      <li><input type="checkbox" />NodeJS Lernen <button>X</button></li>
      </ul>
      </>
  )
}

export default App;