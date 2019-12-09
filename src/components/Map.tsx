import React from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer
} from "@react-google-maps/api";
import { connect } from "react-redux";
require("dotenv").config();

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTripIndex: state.currentTripIndex
  };
};

type MapProps = {
  trips: any;
  currentTripIndex: number;
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

  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.state.response === null ||
      nextState.response.status != this.state.response.status
    );
  }

  directionsCallback(response: any | null) {
    if (response !== null) {
      if (response.status === "OK") {
        console.log(response);
        this.setState(() => ({
          response
        }));
      } else {
        console.log("response: ", response);
      }
    }
  }
  render() {
    console.log(this.props.trips);
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
              directions: this.state.response
            }}
          ></DirectionsRenderer>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default connect(mapStateToProps)(Map);
