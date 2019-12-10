import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import Map from "./Map";

import { Grid } from "@material-ui/core";

type myProps = {
  ongoingTrips: any;
  currentOngoingTripIndex: number;
  onShowChat: any;
  onShowProfile: any;
  onPreviousTrip: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
  users: any;
  toggleNotes: any;
  toggleMessages: any;
  mapTripMessage: any;
};

// I will style this more later -- just wanted it functional for now

class OngoingTripInfo extends React.Component<
  myProps,
  { members: any; previousLength: number }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      members: [],
      previousLength: 0
    };
  }

  deleteTrip(
    tripId: string,
    userId: string,
    memberIds: string[],
    ownerId: string
  ) {
    if (userId === ownerId) {
      myFirestore
        .collection("trips")
        .doc(tripId)
        .delete();
    } else {
      const newMemberIds = memberIds.filter(
        (memberId: string) => memberId !== userId
      );
      myFirestore
        .collection("trips")
        .doc(tripId)
        .update({ memberIds: newMemberIds });
    }
  }

  render() {
    return (
      <div>
        <div className="TripInfo">
          <h1>Trip Details</h1>
          <p>
            Start Date:{" "}
            {moment(
              this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].startDate.toDate()
            ).format("MMMM Do YYYY")}
          </p>
          <p>
            End Date:{" "}
            {moment(
              this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].endDate.toDate()
            ).format("MMMM Do YYYY")}
          </p>
          <p>
            Starting Location:
            {` ${
              this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                .startLocation
            }`}
          </p>
          <div>
            Waypoints:{" "}
            <ul className="waypointsContainer">
              {this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].waypoints.map((l: any, i: number) => {
                return <li key={i}>{l.location}</li>;
              })}
            </ul>
          </div>
          <p>
            Budget:{" "}
            {this.props.ongoingTrips[this.props.currentOngoingTripIndex].budget}
          </p>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => this.props.toggleNotes()}
          >
            Notes
          </Button>
          <br></br>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => this.props.toggleMessages()}
          >
            Messages
          </Button>
          <div>
            Members:{" "}
            <ul className="memberContainer">
              {this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].memberIds.map((m: any, i: number) => {
                return (
                  <li key={i} onClick={() => this.props.onShowProfile(i)}>
                    {
                      this.props.users.find((u: { id: any }) => u.id === m)
                        .nickname
                    }
                  </li>
                );
              })}
            </ul>
          </div>
          <Button
            onClick={() =>
              this.deleteTrip(
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .tripId,
                this.props.userId,
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .memberIds,
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .ownerId
              )
            }
            variant="contained"
            color="secondary"
            size="large"
          >
            UPDATE!
          </Button>

          <Button
            onClick={() =>
              this.deleteTrip(
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .tripId,
                this.props.userId,
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .memberIds,
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .ownerId
              )
            }
            variant="contained"
            color="secondary"
            size="large"
          >
            DELETE!
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
    ongoingTrips: state.ongoingTrips,
    currentOngoingTripIndex: state.currentOngoingTripIndex,
    userId: state.userId,
    users: state.users,
    mapTripMessage: state.mapTripMessage
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
        type: "PREVIOUS_ONGOING_TRIP"
      }),
    onNextTrip: () =>
      dispatch({
        type: "NEXT_ONGOING_TRIP"
      }),
    onJoinTrip: (trip: string, user: string) => {
      myFirestore
        .collection("trips")
        .doc(trip)
        .update({ memberIds: firebase.firestore.FieldValue.arrayUnion(user) });
      dispatch({ type: "JOIN_TRIP" });
    },
    toggleNotes: () =>
      dispatch({
        type: "TOGGLE_NOTES"
      }),
    toggleMessages: () =>
      dispatch({
        type: "TOGGLE_MESSAGES"
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OngoingTripInfo);
