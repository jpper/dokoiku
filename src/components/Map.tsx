import React from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer
} from "@react-google-maps/api";
import { connect } from "react-redux";
require("dotenv").config();

type MapProps = {
  trips: any;
  currentTrip: number;
};

interface MapState {
  response: any;
}

class Map extends React.Component<MapProps, MapState> {
  constructor(props: MapProps) {
    super(props);
    this.state = {
      response: null
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
              origin: this.props.trips[this.props.currentTrip].startLocation
                .location,
              destination: this.props.trips[this.props.currentTrip]
                .startLocation.location,
              waypoints: this.props.trips[this.props.currentTrip].waypoints,
              travelMode: this.props.trips[this.props.currentTrip].travelMode
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

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTrip: state.currentTrip
  };
};

export default connect(mapStateToProps)(Map);
