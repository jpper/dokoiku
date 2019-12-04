import React from "react";

type TripInfoProps = {
  name: string;
  URL: string;
};

export const TripInfo: React.FC<TripInfoProps> = props => {
  return (
    <div className="TripInfo">
      <h1>Trip Details</h1>
      <p>Start Date: </p>
      <p>End Date: </p>
      <p>Locations: </p>
      <p>Budget: </p>
      <p>Notes: </p>
      <p>Members: </p>
    </div>
  );
};
