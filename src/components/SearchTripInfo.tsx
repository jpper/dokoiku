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
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import "../styles/TripInfo.css";

type myProps = {
  searchTrips: any;
  users: any;
  currentSearchTripIndex: number;
  onShowChat: any;
  onShowProfile: any;
  onPreviousTrip: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
};

// I will style this more later -- just wanted it functional for now

class SearchTripInfo extends React.Component<
  myProps,
  { members: any; previousLength: number }
> {
  componentWillMount() {
    const populatedMembers: any = [];
    this.props.searchTrips[this.props.currentSearchTripIndex].memberIds.forEach(
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
            this.props.searchTrips[
              this.props.currentSearchTripIndex
            ].startDate.toDate()
          ).format("MMMM Do YYYY")}
        </Typography>

        {/* End Date */}
        <Typography className="iconWrapper">
          <DateRangeIcon />
          End Date:{" "}
          {moment(
            this.props.searchTrips[
              this.props.currentSearchTripIndex
            ].endDate.toDate()
          ).format("MMMM Do YYYY")}
        </Typography>

        {/* Starting Location */}
        <Typography className="iconWrapper">
          <DoubleArrowIcon />
          Starting Location:
          {` ${
            this.props.searchTrips[this.props.currentSearchTripIndex]
              .startLocation
          }`}
        </Typography>

        {/* WayPoints */}
        <div>
          <List>
            <Typography variant="h5">Waypoints:</Typography>
            {this.props.searchTrips[
              this.props.currentSearchTripIndex
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
          {this.props.searchTrips[this.props.currentSearchTripIndex].budget}
        </Typography>

        <div className="spacer10"></div>

        {/* Members */}
        <List>
          <Typography variant="h5">Members:</Typography>

          {this.props.searchTrips[
            this.props.currentSearchTripIndex
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
        <Button
          onClick={() =>
            this.props.onJoinTrip(
              this.props.searchTrips[this.props.currentSearchTripIndex].tripId,
              this.props.userId
            )
          }
          variant="contained"
          color="primary"
          size="large"
          fullWidth
        >
          <GroupAddIcon />
          JOIN
        </Button>

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
    userId: state.userId,
    searchTrips: state.searchTrips,
    users: state.users,
    currentSearchTripIndex: state.currentSearchTripIndex
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
        type: "PREVIOUS_SEARCH_TRIP"
      }),
    onNextTrip: () =>
      dispatch({
        type: "NEXT_SEARCH_TRIP"
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripInfo);
