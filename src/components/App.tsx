import React from "react";
import "../App.css";
import { TripInfo } from "./TripInfo";
import { Profile } from "./Profile";

const App: React.FC = () => {
  return (
    <div className="App">
      <TripInfo name="Bob" URL="link" />
      <Profile name="Bob" URL="link" />
    </div>
  );
};

export default App;
