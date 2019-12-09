import React from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker
} from "@react-google-maps/api";
import { connect } from "react-redux";
import axios from "axios";
require("dotenv").config();

type MapProps = {
  trips: any;
  currentTripIndex: number;
};

interface MapState {
  response: any;
  positions: any;
}

class Map extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);
    this.state = {
      response: null,
      positions: []
    };
    this.directionsCallback = this.directionsCallback.bind(this);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      nextProps.currentTripIndex !== this.props.currentTripIndex ||
      this.state.response === null ||
      nextState.response.routes[0].overview_polyline !==
        this.state.response.routes[0].overview_polyline ||
      nextState.positions[0] !== this.state.positions[0]
    );
  }

  directionsCallback(response: any | null) {
    if (response !== null) {
      if (response.status === "OK") {
        //console.log(response);
        this.setState(() => ({
          response
        }));
        console.log(
          response.geocoded_waypoints.map((value: any) => value.place_id)
        );
        const responses = response.geocoded_waypoints
          .map((value: any) => value.place_id)
          .map((placeId: string) => {
            return axios.get(
              `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${process.env.REACT_APP_GOOGLE_MAPS_API}`
            );
          });
        Promise.all(responses).then((data: any) => {
          this.setState({
            positions: [
              response.geocoded_waypoints
                .map((value: any) => value.place_id)
                .join(),
              ...data.map(
                (response: any) => response.data.result.geometry.location
              )
            ]
          });
        });
      } else {
        //console.log("response: ", response);
      }
    }
  }
  render() {
    console.log(this.state.positions);
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
          {this.state.positions.length
            ? this.state.positions
                .slice(1)
                .map((position: any, index: number) => (
                  <Marker key={index} position={position} />
                ))
            : null}
          <DirectionsService
            options={{
              origin: this.props.trips[this.props.currentTripIndex]
                .startLocation,
              destination: this.props.trips[this.props.currentTripIndex]
                .startLocation,
              waypoints: this.props.trips[this.props.currentTripIndex]
                .waypoints,
              travelMode: this.props.trips[this.props.currentTripIndex]
                .travelMode
            }}
            callback={this.directionsCallback}
          />
          <DirectionsRenderer
            options={{
              directions: this.state.response,
              suppressMarkers: true
            }}
          ></DirectionsRenderer>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default Map;
