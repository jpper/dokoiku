import React from "react";
import { myFirebase, myFirestore } from "../config/firebase";
import { connect } from "react-redux";

const mapStateToProps = (state: any) => {
  return {
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
    onAddTrip: () =>
      myFirestore
        .collection("trips")
        .add({
          name: "",
          notes: "",
          ownerId: "",
          tripId: "",
          travelMode: "DRIVING",
          startDate: null,
          endDate: null,
          startLocation: "",
          waypoints: [],
          budget: 0,
          memberIds: []
        })
        .then(data => {
          dispatch({
            type: "ADD_TRIP"
          });
        })
  };
};

type BuildProps = {
  trips: any;
  currentTripIndex: number;
  showBuild: boolean;
  onClosePopup: any;
  onShowBuild: any;
  onAddTrip: any;
};
type BuildState = {
  name: string;
  notes: string;
  ownerId: string;
  tripId: string;
  travelMode: string;
  startDate: Date | null;
  endDate: Date | null;
  startLocation: string;
  waypoints: any;
  budget: number;
  memberIds: any;
};

class BuildTrip extends React.Component<BuildProps, BuildState> {
  private startDateInput: React.RefObject<HTMLInputElement>;
  private endDateInput: React.RefObject<HTMLInputElement>;
  private startLocationInput: React.RefObject<HTMLInputElement>;
  private budgetInput: React.RefObject<HTMLInputElement>;
  private nameInput: React.RefObject<HTMLInputElement>;
  constructor(props: BuildProps) {
    super(props);
    this.startDateInput = React.createRef();
    this.endDateInput = React.createRef();
    this.startLocationInput = React.createRef();
    this.budgetInput = React.createRef();
    this.nameInput = React.createRef();
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
      budget: 0,
      memberIds: []
    };
  }
  handleSubmit = (e: any) => {
    e.preventDefault();
  };

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
                  <input type="date" ref={this.nameInput} />
                </label>
                <br />
                <label>
                  Start Date:
                  <input type="date" ref={this.startDateInput} />
                </label>
                <br />
                <label>
                  End Date:
                  <input type="date" ref={this.endDateInput} />
                </label>
                <br />
                <label>
                  Start Location:
                  <input type="text" ref={this.startLocationInput} />
                </label>
                <br />
                <br />
                <label>Waypoints: {this.state.waypoints}</label>
                <br />
                <br />
                <label>
                  Add Waypoints:
                  <input type="text" name="waypoint" />
                  <button>Add waypoint</button>
                </label>
                <br />
                <br />
                <label>
                  Budget:
                  <input type="number" ref={this.budgetInput} />
                </label>
                <br />
                <br />
                <label>Members:</label>
                <br />
                <br />
                <label>
                  Add Members: {this.state.memberIds}
                  <input type="text" name="username" />
                  <button>Add member</button>
                </label>
                <br />
                <br />
                <button type="button" onClick={this.props.onAddTrip}>
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
