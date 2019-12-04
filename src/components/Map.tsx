import React from "react";
import GoogleMapReact from "google-map-react";
require("dotenv").config();

const TemporaryComponent = ({ text }: any) => <div>{text}</div>;

const Map: React.FC = () => {
  const center = { lat: 35.6762, lng: 139.6503 };
  const zoom = 5;
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAPS_API}` }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        <TemporaryComponent lat={35.6762} lng={139.6503} name="My Marker" />
      </GoogleMapReact>
    </div>
  );
};
export default Map;
