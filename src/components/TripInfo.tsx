import React from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

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
        <Paper className="TripInfo">
          <Typography variant="h5" component="h3">
            Trip Details
          </Typography>
          <Paper>
            Start Date: {this.props.trips[this.props.currentTrip].startDate}
          </Paper>
          <Paper>
            End Date: {this.props.trips[this.props.currentTrip].endDate}
          </Paper>
          <div>
            <Paper>
              Starting Location:
              {this.props.trips[this.props.currentTrip].startLocation}
            </Paper>
          </div>
          <div>
            Waypoints:{" "}
            {this.props.trips[this.props.currentTrip].waypoints.map(
              (l: any, i: number) => {
                return <p key={i}>{l.location}</p>;
              }
            )}
          </div>
          <Paper>
            Budget: {this.props.trips[this.props.currentTrip].budget}
          </Paper>
          <Paper>Notes: </Paper>
          <Paper>Messages: </Paper>
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
        </Paper>
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
