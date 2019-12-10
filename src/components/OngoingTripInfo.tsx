import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import Map from "./Map";

// Material UI
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
import PersonIcon from "@material-ui/icons/Person";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UpdateIcon from "@material-ui/icons/Update";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ChatIcon from "@material-ui/icons/Chat";
import DescriptionIcon from "@material-ui/icons/Description";
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
        {/* Title */}
        <Typography variant="h3" className="typoH3">
          <b>Trip Details</b>
        </Typography>

        {/* Start Date */}
        <Typography className="iconWrapper">
          <DateRangeIcon />
          Start Date:{" "}
          {moment(
            this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].startDate.toDate()
          ).format("MMMM Do YYYY")}
        </Typography>

        {/* End Date */}
        <Typography className="iconWrapper">
          <DateRangeIcon />
          End Date:{" "}
          {moment(
            this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].endDate.toDate()
          ).format("MMMM Do YYYY")}
        </Typography>

        {/* Starting Location */}
        <Typography className="iconWrapper">
          <DoubleArrowIcon />
          Starting Location:
          {` ${
            this.props.ongoingTrips[this.props.currentOngoingTripIndex]
              .startLocation
          }`}
        </Typography>

        {/* WayPoints */}
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

        {/* Budget */}
        <Typography className="iconWrapper">
          <MonetizationOnIcon />
          Budget:{" "}
          {this.props.ongoingTrips[this.props.currentOngoingTripIndex].budget}
        </Typography>

        <div className="spacer10"></div>

        {/* Notes & Messages */}
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          fullWidth
          onClick={() => this.props.toggleNotes()}
        >
          <DescriptionIcon className="iconSpacer" />
          Notes
        </Button>
        <br></br>
        <Button
          variant="outlined"
          color="primary"
          size="medium"
          fullWidth
          onClick={() => this.props.toggleMessages()}
        >
          <ChatIcon className="iconSpacer" />
          Messages
        </Button>

        {/* Members */}
        <div>
          <List>
            <Typography variant="h5">Members:</Typography>

            {this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].memberIds.map((m: any, i: number) => {
              return (
                <ListItem
                  key={i}
                  button
                  alignItems="center"
                  onClick={() => this.props.onShowProfile(i)}
                  className="tripLocation"
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      this.props.users.find((u: { id: any }) => u.id === m)
                        .nickname
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </div>

        {/* Update & Delete button */}
        <Grid container>
          <Grid item xs={6}>
            <Button
              fullWidth
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
              color="primary"
              size="large"
            >
              <UpdateIcon />
              UPDATE
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
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
              <DeleteForeverIcon />
              DELETE
            </Button>
          </Grid>
        </Grid>

        {/* Previous & Next Button */}
        <Grid container>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="default"
              size="small"
              fullWidth
              onClick={this.props.onPreviousTrip}
            >
              <ArrowBackIosIcon />
              Previous
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              variant="contained"
              color="default"
              size="small"
              fullWidth
              onClick={this.props.onNextTrip}
            >
              Next
              <ArrowForwardIosIcon />
            </Button>
          </Grid>
        </Grid>
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
    onPreviousTrip: () => {
      dispatch({
        type: "RESET_TOGGLE_MESSAGES"
      });
      dispatch({
        type: "PREVIOUS_ONGOING_TRIP"
      });
    },
    onNextTrip: () => {
      dispatch({
        type: "RESET_TOGGLE_MESSAGES"
      });
      dispatch({
        type: "NEXT_ONGOING_TRIP"
      });
    },
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
