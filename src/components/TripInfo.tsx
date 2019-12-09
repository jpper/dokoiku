import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";

type myProps = {
  trips: any;
  currentTrip: number;
  onShowChat: any;
  onShowProfile: any;
  onPreviousTrip: any;
  onNextTrip: any;
};

class TripInfo extends React.Component<myProps, {}> {
  render() {
    return (
      <div>
        <div className="TripInfo">
          <h1>Trip Details</h1>
          <div>
            Start Date: {this.props.trips[this.props.currentTrip].startDate}
          </div>
          <div>
            End Date: {this.props.trips[this.props.currentTrip].endDate}
          </div>
          <div>
            <div>
              Starting Location:
              {` ${this.props.trips[this.props.currentTrip].startLocation}`}
            </div>
          </div>
          <div>
            Waypoints:{" "}
            {this.props.trips[this.props.currentTrip].waypoints.map(
              (l: any, i: number) => {
                return <p key={i}>{l.location}</p>;
              }
            )}
          </div>
          <div>Budget: {this.props.trips[this.props.currentTrip].budget}</div>
          <div>Notes: </div>
          <div>Messages: </div>
          <div>
            Members:{" "}
            {this.props.trips[this.props.currentTrip].memberIds.map(
              (m: any, i: number) => {
                return (
                  <div>
                    <p key={i} onClick={() => this.props.onShowProfile(i)}>
                      username: {m.username}
                    </p>
                  </div>
                );
              }
            )}
          </div>
          <Button variant="contained" color="primary" size="large">
            JOIN!
          </Button>
          <div className="navButtons">
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={this.props.onPreviousTrip}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={this.props.onNextTrip}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTrip: state.currentTrip
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowChat: () =>
      dispatch({
        type: "SHOW_CHAT"
      }),
    onShowProfile: (index: number) =>
      dispatch({
        type: "SHOW_PROFILE",
        index
      }),
    onPreviousTrip: () =>
      dispatch({
        type: "PREVIOUS_TRIP"
      }),
    onNextTrip: () =>
      dispatch({
        type: "NEXT_TRIP"
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TripInfo);
