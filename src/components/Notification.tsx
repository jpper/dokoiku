import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Popover
} from "@material-ui/core";
import { myFirestore } from "../config/firebase";
import { removeRequest } from "../redux/action";
import firebase from "firebase";
import Profile from "./Profile";
import "../styles/Notification.css";

type myProps = {
  requests: any;
  users: any;
  ongoingTrips: any;
  userId: string;
  removeRequest: any;
  onChangeDisplayProfile: any;
  displayProfile: string;
};

const mapStateToProps = (state: any) => {
  return {
    requests: state.requests,
    users: state.users,
    ongoingTrips: state.ongoingTrips,
    userId: state.userId,
    displayProfile: state.displayProfile
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    removeRequest: (tripId: string, fromId: string) => {
      dispatch(removeRequest(tripId, fromId));
    },
    onChangeDisplayProfile: (profile: string) =>
      dispatch({
        type: "CHANGE_DISPLAY_PROFILE",
        displayProfile: profile
      })
  };
};

class Notification extends React.Component<myProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      togglePopover: false,
      anchorEl: null
    };
  }
  acceptRequest = (ownerId: string, tripId: string, fromId: string) => {
    this.props.removeRequest(tripId, fromId);
    myFirestore
      .collection("users")
      .doc(ownerId)
      .collection("requests")
      .doc(fromId + tripId)
      .delete();
    myFirestore
      .collection("users")
      .doc(fromId)
      .collection("pendingTrips")
      .doc(tripId)
      .delete();
    myFirestore
      .collection("trips")
      .doc(tripId)
      .update({
        memberIds: firebase.firestore.FieldValue.arrayUnion(fromId)
      });
  };
  rejectRequest = (ownerId: string, tripId: string, fromId: string) => {
    this.props.removeRequest(tripId, fromId);
    myFirestore
      .collection("users")
      .doc(ownerId)
      .collection("requests")
      .doc(fromId + tripId)
      .delete();
    myFirestore
      .collection("users")
      .doc(fromId)
      .collection("pendingTrips")
      .doc(tripId)
      .delete();
  };

  handlePopoverToggle = () => {
    this.setState({
      togglePopover: !this.state.togglePopover
    });
  };

  setAnchorEl = (anchorEl: any) => {
    this.setState({
      anchorEl
    });
  };

  render() {
    //console.log(this.props.requests);
    return (
      <div>
        {this.props.requests.length ? (
          this.props.requests.map((request: any) => {
            const user = this.props.users.find(
              (user: any) => user.id === request.fromId
            );
            console.log(user);
            return (
              <div>
                <CardContent>
                  <Typography>
                    You have a request from{" "}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={event => {
                        this.handlePopoverToggle();
                        this.props.onChangeDisplayProfile(user.id);
                        this.setAnchorEl(event.currentTarget);
                        console.log(this.state.anchorEl);
                      }}
                    >
                      {user.nickname}{" "}
                    </Button>
                    for{" "}
                    {
                      this.props.ongoingTrips.find(
                        (trip: any) => trip.tripId === request.tripId
                      ).name
                    }
                  </Typography>
                  <div id="profile-popover">
                    <Popover
                      style={{
                        height: "500px",
                        width: "500px"
                      }}
                      anchorEl={this.state.anchorEl}
                      open={this.state.togglePopover}
                      onClose={() => {
                        this.handlePopoverToggle();
                        this.props.onChangeDisplayProfile(null);
                      }}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left"
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                      }}
                    >
                      <Profile />
                    </Popover>
                  </div>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={e => {
                      this.acceptRequest(
                        this.props.userId,
                        request.tripId,
                        request.fromId
                      );
                    }}
                  >
                    Accept
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={e => {
                      this.rejectRequest(
                        this.props.userId,
                        request.tripId,
                        request.fromId
                      );
                    }}
                  >
                    Reject
                  </Button>
                </CardActions>
              </div>
            );
          })
        ) : (
          <div>You don't have any notifications.</div>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
