import React from "react";
import { myFirebase, myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";
import { FormControl, TextField, Button } from "@material-ui/core";
import firebase, { firestore } from "firebase";

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    trips: state.trips,
    currentTripIndex: state.currentTripIndex,
    showBuild: state.showBuild
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowBuild: (index: number) =>
      dispatch({
        type: "SHOW_BUILD",
        index
      }),
    onClosePopup: () =>
      dispatch({
        type: "CLOSE_POPUP"
      }),
    onAddTrip: (
      name: string,
      userId: string,
      startDate: string,
      endDate: string,
      startLocation: string,
      waypoints: any,
      budget: string
    ) => {
      const tripId = uuidv4();
      myFirestore
        .collection("trips")
        .doc(tripId)
        .set({
          name,
          notes: "",
          ownerId: userId,
          tripId,
          travelMode: "DRIVING",
          startDate: firestore.Timestamp.fromDate(new Date(startDate)),
          endDate: firestore.Timestamp.fromDate(new Date(endDate)),
          startLocation,
          waypoints,
          budget,
          memberIds: []
        });
    }
  };
};

type BuildProps = {
  trips: any;
  currentTripIndex: number;
  showBuild: boolean;
  onClosePopup: any;
  onShowBuild: any;
  onAddTrip: any;
  userId: string;
};
type BuildState = {
  name: string;
  notes: string;
  ownerId: string;
  tripId: string;
  travelMode: string;
  startDate: string | null;
  endDate: string | null;
  startLocation: string;
  waypoints: any;
  addedWaypoint: string;
  budget: number;
  memberIds: any;
};

class BuildTrip extends React.Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);
    this.state = {
      name: "",
      notes: "",
      ownerId: "",
      tripId: "",
      travelMode: "DRIVING",
      startDate: null,
      endDate: null,
      startLocation: "",
      waypoints: [],
      addedWaypoint: "",
      budget: 0,
      memberIds: []
    };
  }
  clearState() {
    this.setState({
      name: "",
      notes: "",
      ownerId: "",
      tripId: "",
      travelMode: "DRIVING",
      startDate: null,
      endDate: null,
      startLocation: "",
      waypoints: [],
      addedWaypoint: "",
      budget: 0,
      memberIds: []
    });
  }
  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.props.onShowBuild}
        >
          BUILD TRIP
        </Button>
        {this.props.showBuild ? (
          <div>
            <div className="BuildTrip">
              <h1>Build Trip</h1>
              <FormControl>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  value={this.state.name}
                  onChange={(e: any) => {
                    this.setState({ name: e.currentTarget.value });
                  }}
                />
                <br />
                <TextField
                  id="start-date"
                  label="Start Date"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.startDate}
                  onChange={(e: any) => {
                    this.setState({ startDate: e.currentTarget.value });
                  }}
                />
                <br />
                <TextField
                  id="end-date"
                  label="End Date"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={this.state.endDate}
                  onChange={(e: any) => {
                    this.setState({ endDate: e.currentTarget.value });
                  }}
                />
                <br />
                <TextField
                  id="start-location"
                  label="Start Location"
                  variant="outlined"
                  value={this.state.startLocation}
                  onChange={(e: any) => {
                    this.setState({ startLocation: e.currentTarget.value });
                  }}
                />
                <br />
                <label>Places:</label>
                {this.state.waypoints.length
                  ? this.state.waypoints.map((waypoint: any) => (
                      <div>{waypoint.location}</div>
                    ))
                  : null}
                <br />
                <TextField
                  id="places"
                  label="Places"
                  variant="outlined"
                  value={this.state.addedWaypoint}
                  onChange={(e: any) => {
                    this.setState({ addedWaypoint: e.currentTarget.value });
                  }}
                />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({
                      waypoints: this.state.waypoints.concat([
                        {
                          location: this.state.addedWaypoint,
                          stopover: true
                        }
                      ]),
                      addedWaypoint: ""
                    });
                  }}
                >
                  Add Place
                </Button>
                <br />
                <TextField
                  id="budget"
                  label="My Budget"
                  type="number"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={this.state.budget}
                  onChange={(e: any) => {
                    this.setState({ budget: e.currentTarget.value });
                  }}
                />
                <br />
                {this.state.name &&
                this.state.travelMode &&
                this.state.startDate &&
                this.state.endDate &&
                this.state.startLocation &&
                this.state.waypoints.length &&
                this.state.budget ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.props.onAddTrip(
                        this.state.name,
                        this.props.userId,
                        this.state.startDate,
                        this.state.endDate,
                        this.state.startLocation,
                        this.state.waypoints,
                        this.state.budget
                      );
                      this.clearState();
                      this.props.onClosePopup();
                    }}
                  >
                    Submit My Trip
                  </Button>
                ) : (
                  <Button variant="contained" disabled>
                    Please Fill Out the Form
                  </Button>
                )}
                <br />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.props.onClosePopup}
                >
                  Close
                </Button>
              </FormControl>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildTrip);
