import React from "react";
import { connect } from "react-redux";

type BuildProps = {
  trips: any;
  currentTrip: number;
  showBuild: boolean;
  onClosePopup: any;
  onShowBuild: any;
  onAddTrip: any;
};

type BuildState = {};

class BuildTrip extends React.Component<BuildProps, BuildState> {
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
              <form onSubmit={this.props.onAddTrip}>
                <label>
                  Start Date:
                  <input type="date" name="start" />
                </label>
                <br />
                <label>
                  End Date:
                  <input type="date" name="end" />
                </label>
                <br />
                <label>
                  Start Location:
                  <input type="text" name="location" />
                </label>
                <br />
                <br />
                <label>Waypoints:</label>
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
                  <input type="number" name="budget" />
                </label>
                <br />
                <br />
                <label>Members:</label>
                <br />
                <br />
                <label>
                  Add Members:
                  <input type="text" name="username" />
                  <button>Add member</button>
                </label>
                <br />
                <br />
                <input type="submit" value="Submit Trip" />
              </form>
              <button onClick={this.props.onClosePopup}>Close</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTrip: state.currentTrip,
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
    onAddTrip: (index: number) =>
      dispatch({
        type: "ADD_TRIP",
        index
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BuildTrip);
