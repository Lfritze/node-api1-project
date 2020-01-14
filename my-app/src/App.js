import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [person, setPerson] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users")
      .then(res => {
        console.log(res.data);
        setPerson(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="App">
      {person.map(personName => {
        return <p key={personName.id}>{personName.name}</p>;
      })}
    </div>
  );
}

export default App;
