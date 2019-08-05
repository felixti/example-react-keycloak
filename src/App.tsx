import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useKeycloak } from 'react-keycloak';
import axios from 'axios'

const App: React.FC = () => {
  const { keycloak, initialized } = useKeycloak()
  console.log(keycloak.token)
  console.log(initialized)
  const [values, setValues] = useState([])
 console.log(values)
  useEffect(() => { 
    axios.get('https://localhost:5001/api/values', { headers: { Authorization: `bearer ${keycloak.token}`}})
    .then(response => response.data)
    .then(data => setValues(data))
  }, [keycloak])

  // const claims = keycloak.token && jwtDecode<any>(keycloak.token as string)
  return keycloak.authenticated ? (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${values[0]}-${values[1]}`}
          </a>
        </header>
  </div> )
    :
    (
      <div>Loading...</div>
    )
}

export default App;
