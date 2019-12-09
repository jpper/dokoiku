import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";

type myProps = {
  trips: any;
  currentTripIndex: number;
  onShowChat: any;
  onShowProfile: any;
  onPreviousTrip: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
};

// I will style this more later -- just wanted it functional for now

class TripInfo extends React.Component<myProps, {}> {
  // componentDidMount() {
  //   console.log(this.props.trips);
  //   console.log(this.props.currentTripIndex);
  // }

  render() {
    return (
      <div>
        <div className="TripInfo">
          <h1>Trip Details</h1>
          <p>
            Start Date:{" "}
            {moment(
              this.props.trips[this.props.currentTripIndex].startDate.toDate()
            ).format("MMMM Do YYYY")}
          </p>
          <p>
            End Date:{" "}
            {moment(
              this.props.trips[this.props.currentTripIndex].endDate.toDate()
            ).format("MMMM Do YYYY")}
          </p>
          <p>
            Starting Location:
            {` ${this.props.trips[this.props.currentTripIndex].startLocation}`}
          </p>
          <div>
            Waypoints:{" "}
            <div className="waypointsContainer">
              {this.props.trips[this.props.currentTripIndex].waypoints.map(
                (l: any, i: number) => {
                  return <p key={i}>{l.location}</p>;
                }
              )}
            </div>
          </div>
          <p>Budget: {this.props.trips[this.props.currentTripIndex].budget}</p>
          <Button variant="outlined" color="secondary" size="small">
            Notes
          </Button>
          <br></br>
          <Button variant="outlined" color="secondary" size="small">
            Messages
          </Button>
          <div>
            Members:{" "}
            <div className="memberContainer">
              {this.props.trips[this.props.currentTripIndex].memberIds.map(
                (m: any, i: number) => {
                  return (
                    <div>
                      <p key={i} onClick={() => this.props.onShowProfile(i)}>
                        Member: {m}
                        {/* Need a function to map member ID to member name */}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          <Button
            onClick={() =>
              this.props.onJoinTrip(
                this.props.trips[this.props.currentTripIndex].tripId,
                this.props.userId
              )
            }
            variant="contained"
            color="primary"
            size="large"
          >
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
    userId: state.userId,
    trips: state.trips,
    currentTripIndex: state.currentTripIndex
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
      }),
    onJoinTrip: (trip: string, user: string) => {
      myFirestore
        .collection("trips")
        .doc(trip)
        .update({ memberIds: firebase.firestore.FieldValue.arrayUnion(user) });
      dispatch({ type: "JOIN_TRIP" });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TripInfo);
