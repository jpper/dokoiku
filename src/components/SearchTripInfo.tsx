import React from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import moment from "moment";
// import firebase from "firebase";
import { myFirestore } from "../config/firebase";

// Material UI and styling
import "../styles/Modal.css";
import {
  Grid,
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
  onPreviousTrip: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
  onChangeDisplayProfile: any;
  displayProfile: string;
};

class SearchTripInfo extends React.Component<myProps, {}> {
  render() {
    if (this.props.users.length) {
      return (
        <div className="TripInfo">
          {/* Title */}
          <Typography variant="h3" className="typoH3">
            <b>
              {this.props.searchTrips[this.props.currentSearchTripIndex].name}
            </b>
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

          <div>
            <Typography variant="h5">Owned by:</Typography>
            <div>
              {[
                this.props.searchTrips[this.props.currentSearchTripIndex]
                  .memberIds[0]
              ].map((m: any, i: number) => {
                const nickname = this.props.users.find(
                  (u: { id: any }) => u.id === m
                ).nickname;
                return (
                  <div>
                    <p
                      key={i}
                      onClick={() => {
                        this.props.onChangeDisplayProfile(m);
                      }}
                    >
                      <PersonIcon className="iconSpacer" />
                      {nickname}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <Typography variant="h5">Members:</Typography>
            <div className="memberContainer">
              {this.props.searchTrips[this.props.currentSearchTripIndex]
                .memberIds.length === 1
                ? "There is currently 1 member!"
                : "There are currently " +
                  this.props.searchTrips[this.props.currentSearchTripIndex]
                    .memberIds.length +
                  " members!"}
            </div>
          </div>
          <Button
            onClick={() =>
              this.props.onJoinTrip(
                this.props.searchTrips[this.props.currentSearchTripIndex]
                  .ownerId,
                this.props.userId,
                this.props.searchTrips[this.props.currentSearchTripIndex].tripId
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
    } else {
      return "Loading...";
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    searchTrips: state.searchTrips,
    users: state.users,
    currentSearchTripIndex: state.currentSearchTripIndex,
    displayProfile: state.displayProfile
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowChat: () =>
      dispatch({
        type: "SHOW_CHAT"
      }),
    onPreviousTrip: () =>
      dispatch({
        type: "PREVIOUS_SEARCH_TRIP"
      }),
    onNextTrip: () =>
      dispatch({
        type: "NEXT_SEARCH_TRIP"
      }),
    onJoinTrip: (ownerId: string, userId: string, tripId: string) => {
      myFirestore
        .collection("users")
        .doc(ownerId)
        .collection("requests")
        .doc(userId + tripId)
        .set({
          fromId: userId,
          tripId: tripId
        });
      myFirestore
        .collection("users")
        .doc(userId)
        .collection("pendingTrips")
        .doc(tripId)
        .set({ tripId });
    },
    onChangeDisplayProfile: (profile: string) =>
      dispatch({
        type: "CHANGE_DISPLAY_PROFILE",
        displayProfile: profile
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripInfo);
