import React from "react";
import TripInfo from "./TripInfo";
import Profile from "./Profile";
import "../styles/App.css";
import Map from "./Map";

const App: React.FC = () => {
  return (
    <div className="App">
      <TripInfo />
      <Profile />
      <Map />
    </div>
  );
};

export default App;
