import React from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer
} from "@react-google-maps/api";
require("dotenv").config();

interface MapProps {}

interface MapState {
  locations: { lat: number; lng: number }[];
  response: any;
  travelMode: any;
  waypoints: any;
}

export default class Map extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);
    this.state = {
      locations: [
        {
          lat: 35.689722,
          lng: 139.692222
        }
      ],
      response: null,
      travelMode: "DRIVING",
      waypoints: [
        {
          location: { lat: 35.011667, lng: 135.768333 },
          stopover: true
        },
        {
          location: { lat: 36.561056, lng: 136.656417 },
          stopover: true
        }
      ]
    };
    this.directionsCallback = this.directionsCallback.bind(this);
  }
  directionsCallback(response: any | null) {
    console.log(response);
    if (response !== null) {
      if (response.status === "OK") {
        this.setState(() => ({
          response
        }));
      } else {
        console.log("response: ", response);
      }
    }
  }
  render() {
    return (
      <LoadScript
        id="script-loader"
        googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_API}`}
      >
        <GoogleMap
          id="example-map"
          mapContainerStyle={{
            height: "600px",
            width: "600px"
          }}
          zoom={6}
          center={{
            lat: 35.689722,
            lng: 139.692222
          }}
        >
          <DirectionsService
            options={{
              origin: this.state.locations[0],
              destination: this.state.locations[0],
              waypoints: this.state.waypoints,
              travelMode: this.state.travelMode
            }}
            callback={this.directionsCallback}
          />
          {this.state.response !== null && (
            <DirectionsRenderer
              options={{
                directions: this.state.response
              }}
            ></DirectionsRenderer>
          )}
        </GoogleMap>
      </LoadScript>
    );
  }
}
