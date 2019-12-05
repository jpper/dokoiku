import React from "react";
import { TripInfo } from "./TripInfo";
import { Profile } from "./Profile";
import Map from "./Map";
import "../styles/App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <TripInfo name="Bob" URL="link" />
      <Profile name="Bob" URL="link" />
      <Map />
    </div>
  );
};

export default App;
