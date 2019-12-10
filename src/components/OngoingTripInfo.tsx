import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import Map from "./Map";

// Material UI
import "../styles/Modal.css";
import {
  Grid,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import "../styles/TripInfo.css";

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
      <div className="TripInfo">
        <h1>Trip Details</h1>
        <p>
          <DateRangeIcon />
          Start Date:{" "}
          {moment(
            this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].startDate.toDate()
          ).format("MMMM Do YYYY")}
        </p>
        <p>
          <DateRangeIcon />
          End Date:{" "}
          {moment(
            this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].endDate.toDate()
          ).format("MMMM Do YYYY")}
        </p>
        <p>
          <DoubleArrowIcon />
          Starting Location:
          {` ${
            this.props.ongoingTrips[this.props.currentOngoingTripIndex]
              .startLocation
          }`}
        </p>
        <div>
          <List>
            <Typography variant="h5">Waypoints:</Typography>
            {this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].waypoints.map((l: any, i: number) => {
              return (
                <ListItem key={i} className="tripLocation">
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary={l.location} />
                </ListItem>
              );
            })}
          </List>
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
          <div className="memberContainer">
            {this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].memberIds.map((m: any, i: number) => {
              const nickname = this.props.users.find(
                (u: { id: any }) => u.id === m
              ).nickname;
              const photo = this.props.users.find(
                (u: { id: any }) => u.id === m
              ).photoUrl;
              const facebook = this.props.users.find(
                (u: { id: any }) => u.id === m
              ).facebook;
              return (
                <div>
                  <p
                    key={i}
                    onClick={() => {
                      const modal = document.getElementById(i.toString());
                      modal.style.display = "block";
                    }}
                  >
                    {nickname}
                  </p>
                  <div className="modal" id={i.toString()}>
                    <div className="modal-content">
                      <img src={photo} alt={nickname} />
                      <p>{nickname}</p>
                      {facebook ? (
                        <a href={facebook}>
                          <img
                            src="https://www.facebook.com/images/fb_icon_325x325.png"
                            alt="Facebook"
                            id="fb-icon"
                          />
                        </a>
                      ) : null}
                      <br></br>
                      <button
                        className="close"
                        onClick={() => {
                          const modal = document.getElementById(i.toString());
                          modal.style.display = "none";
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
