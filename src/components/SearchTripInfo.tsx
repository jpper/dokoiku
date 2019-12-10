import React from "react";
import { connect } from "react-redux";
import { Button, Paper } from "@material-ui/core";
import moment from "moment";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import Map from "./Map";

// Material UI and styling
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
        <h1>Trip Details</h1>
        <p>
          <DateRangeIcon />
          Start Date:{" "}
          {moment(
            this.props.searchTrips[
              this.props.currentSearchTripIndex
            ].startDate.toDate()
          ).format("MMMM Do YYYY")}
        </p>
        <p>
          <DateRangeIcon />
          End Date:{" "}
          {moment(
            this.props.searchTrips[
              this.props.currentSearchTripIndex
            ].endDate.toDate()
          ).format("MMMM Do YYYY")}
        </p>
        <p>
          <DoubleArrowIcon />
          Starting Location:
          {` ${
            this.props.searchTrips[this.props.currentSearchTripIndex]
              .startLocation
          }`}
        </p>
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
        <p>
          Budget:{" "}
          {this.props.searchTrips[this.props.currentSearchTripIndex].budget}
        </p>
        <div>
          Members:{" "}
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
              this.props.searchTrips[this.props.currentSearchTripIndex].tripId,
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
