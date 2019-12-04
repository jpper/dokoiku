import React from "react";
import logo from "../logo.svg";
import "../styles/App.css";
import Map from "./Map";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>

        <Map />
      </header>
    </div>
  );
};

export default App;
