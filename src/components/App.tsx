import React from "react";
import { TripInfo } from "./TripInfo";
import { Profile } from "./Profile";
import "../styles/App.css";
import Map from "./Map";

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
