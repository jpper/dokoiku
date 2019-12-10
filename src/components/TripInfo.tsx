import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import Map from "./Map";

import { Grid } from "@material-ui/core";

type myProps = {
  trips: any;
  currentTripIndex: number;
  onShowChat: any;
  onShowProfile: any;
  onPreviousTrip: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
  toggleNotes: any;
  toggleMessages: any;
  mapTripMessage: any;
};

// I will style this more later -- just wanted it functional for now

class TripInfo extends React.Component<
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

  componentWillMount() {
    const populatedMembers: any = [];
    this.props.trips[this.props.currentTripIndex].memberIds.forEach(
      async (m: any) => {
        const username = await myFirestore
          .collection("users")
          .doc(m)
          .get()
          .then(doc => doc.data().nickname);
        populatedMembers.push(username);
      }
    );
    this.setState({ members: populatedMembers });
  }

  async componentDidUpdate() {
    if (this.state.members.length !== this.state.previousLength) {
      const populatedMembers: any = [];
      this.props.trips[this.props.currentTripIndex].memberIds.forEach(
        async (m: any) => {
          const username = await myFirestore
            .collection("users")
            .doc(m)
            .get()
            .then(doc => doc.data().nickname);
          populatedMembers.push(username);
        }
      );
      this.setState({
        members: populatedMembers,
        previousLength: populatedMembers.length
      });
    }
  }

  render() {
    console.log(this.props.currentTripIndex);
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
            <ul className="waypointsContainer">
              {this.props.trips[this.props.currentTripIndex].waypoints.map(
                (l: any, i: number) => {
                  return <li key={i}>{l.location}</li>;
                }
              )}
            </ul>
          </div>
          <p>Budget: {this.props.trips[this.props.currentTripIndex].budget}</p>
          <Button variant="outlined" color="secondary" size="small"
          onClick={() => this.props.toggleNotes(this.props.mapTripMessage)}
          >
            Notes
          </Button>
          <br></br>
          <Button variant="outlined" color="secondary" size="small"
          onClick={() => this.props.toggleMessages(this.props.mapTripMessage)}
          >
            Messages
          </Button>
          <div>
            Members:{" "}
            <ul className="memberContainer">
              {this.props.trips[this.props.currentTripIndex].memberIds.map(
                (m: any, i: number) => {
                  return (
                    <li>
                      <p key={i} onClick={() => this.props.onShowProfile(i)}>
                        {this.state.members[i]}
                      </p>
                    </li>
                  );
                }
              )}
            </ul>
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
    currentTripIndex: state.currentTripIndex,
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
        type: "PREVIOUS_TRIP"
      }),
    onNextTrip: () =>
      dispatch({
        type: "NEXT_TRIP"
      }),
    toggleNotes: () =>
      dispatch({
        type: "TOGGLE_NOTES"
      }),
    toggleMessages: () =>
      dispatch({
        type: "TOGGLE_MESSAGES"
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TripInfo);
