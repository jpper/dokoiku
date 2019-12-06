import React from "react";
import { connect } from "react-redux";

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
          <p>
            Start Date: {this.props.trips[this.props.currentTrip].startDate}
          </p>
          <p>End Date: {this.props.trips[this.props.currentTrip].endDate}</p>
          <div>
            <p>
              Starting Location:
              {this.props.trips[this.props.currentTrip].startLocation}
            </p>
          </div>
          <div>
            Waypoints:{" "}
            {this.props.trips[this.props.currentTrip].waypoints.map(
              (l: any, i: number) => {
                return <p key={i}>{l.location}</p>;
              }
            )}
          </div>
          <p>Budget: {this.props.trips[this.props.currentTrip].budget}</p>
          <p>Notes: </p>
          <p>Messages: </p>
          <div>
            Members:{" "}
            {this.props.trips[this.props.currentTrip].members.map(
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
        </div>
        <button onClick={this.props.onPreviousTrip}>Previous</button>
        <button onClick={this.props.onNextTrip}>Next</button>
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
