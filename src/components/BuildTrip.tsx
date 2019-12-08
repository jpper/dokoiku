import React from "react";
import { myFirebase, myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import uuidv4 from "uuid/v4";

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
          startDate,
          endDate,
          startLocation,
          waypoints: [],
          budget,
          memberIds: []
        })
        .then(data => {
          dispatch({
            type: "ADD_TRIP"
          });
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
  render() {
    return (
      <div>
        <button
          className="btnBuild"
          type="submit"
          onClick={this.props.onShowBuild}
        >
          BUILD TRIP
        </button>
        {this.props.showBuild ? (
          <div>
            <div className="BuildTrip">
              <h1>Build Trip</h1>
              <form>
                <label>
                  Name:
                  <input
                    type="text"
                    value={this.state.name}
                    onChange={(e: any) => {
                      this.setState({ name: e.currentTarget.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={this.state.startDate}
                    onChange={(e: any) => {
                      console.log(e.currentTarget.value);
                      this.setState({ startDate: e.currentTarget.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  End Date:
                  <input
                    type="date"
                    value={this.state.endDate}
                    onChange={(e: any) => {
                      this.setState({ endDate: e.currentTarget.value });
                    }}
                  />
                </label>
                <br />
                <label>
                  Start Location:
                  <input
                    type="text"
                    value={this.state.startLocation}
                    onChange={(e: any) => {
                      this.setState({ startLocation: e.currentTarget.value });
                    }}
                  />
                </label>
                <br />
                <br />
                <label>Places:</label>
                {this.state.waypoints.length
                  ? this.state.waypoints.map((waypoint: string) => (
                      <div>{waypoint}</div>
                    ))
                  : null}
                <br />
                <br />
                <label>
                  Add Places:
                  <input
                    type="text"
                    value={this.state.addedWaypoint}
                    onChange={e =>
                      this.setState({
                        addedWaypoint: e.currentTarget.value
                      })
                    }
                    name="waypoint"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      this.setState({
                        waypoints: this.state.waypoints.concat([
                          this.state.addedWaypoint
                        ]),
                        addedWaypoint: ""
                      });
                    }}
                  >
                    Add place
                  </button>
                </label>
                <br />
                <br />
                <label>
                  My Budget:
                  <input
                    type="number"
                    value={this.state.budget}
                    onChange={(e: any) => {
                      this.setState({ budget: e.currentTarget.value });
                    }}
                  />
                </label>
                <br />
                <button
                  type="button"
                  onClick={() => {
                    this.props.onAddTrip(
                      this.state.name,
                      this.props.userId,
                      this.state.startDate,
                      this.state.endDate,
                      this.state.startLocation,
                      this.state.budget
                    );
                    this.props.onClosePopup();
                  }}
                >
                  Submit Trip
                </button>
              </form>
              <button onClick={this.props.onClosePopup}>Close</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuildTrip);
