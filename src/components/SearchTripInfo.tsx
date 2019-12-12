import React, { useImperativeHandle } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
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
};

class SearchTripInfo extends React.Component<myProps, {}> {
  render() {
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
          <Typography variant="h5">Members:</Typography>
          <div className="memberContainer">
            {this.props.searchTrips[
              this.props.currentSearchTripIndex
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
                    <PersonIcon className="iconSpacer" />
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
            this.props.onJoinTrip(
              this.props.searchTrips[this.props.currentSearchTripIndex].ownerId,
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
      //Refactor this so that it changes the state and is redux compliant (dispatch add trip??)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripInfo);
