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
import "../styles/TripInfo.css";

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
      <div className="TripInfo">
        <h1>Trip Details</h1>
        <p>
          <DateRangeIcon />
          Start Date:{" "}
          {moment(
            this.props.trips[this.props.currentTripIndex].startDate.toDate()
          ).format("MMMM Do YYYY")}
        </p>
        <p>
          <DateRangeIcon />
          End Date:{" "}
          {moment(
            this.props.trips[this.props.currentTripIndex].endDate.toDate()
          ).format("MMMM Do YYYY")}
        </p>
        <p>
          <DoubleArrowIcon />
          Starting Location:
          {` ${this.props.trips[this.props.currentTripIndex].startLocation}`}
        </p>
        <div>
          <List>
            <Typography variant="h5">Waypoints:</Typography>
            {this.props.trips[this.props.currentTripIndex].waypoints.map(
              (l: any, i: number) => {
                return (
                  <ListItem key={i} className="tripLocation">
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={l.location} />
                  </ListItem>
                );
              }
            )}
          </List>
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
