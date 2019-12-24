import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { Request, Trip, User } from "../redux/stateTypes";
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
import "../styles/Notification.css";

import ProfilePopover from "./ProfilePopover";

type MapStateToProps = {
  requests: Request[];
  users: User[];
  ongoingTrips: Trip[];
  userId: string;
  displayProfile: string;
};

type myStates = {
  togglePopover: boolean;
  anchorEl: HTMLButtonElement;
};

const mapStateToProps = (state: MapStateToProps) => {
  return {
    requests: state.requests,
    users: state.users,
    ongoingTrips: state.ongoingTrips,
    userId: state.userId,
    displayProfile: state.displayProfile
  };
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
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

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Notification extends React.Component<Props, myStates> {
  constructor(props: Props) {
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

  setAnchorEl = (anchorEl: HTMLButtonElement) => {
    this.setState({
      anchorEl
    });
  };

  render() {
    return (
      <div>
        {this.props.requests.length ? (
          this.props.requests.map((request: Request) => {
            const user = this.props.users.find(
              (user: User) => user.id === request.fromId
            );
            const foundRequest = this.props.ongoingTrips.find(
              (trip: Trip) => trip.tripId === request.tripId
            );
            if (!foundRequest) {
              this.rejectRequest(
                this.props.userId,
                request.tripId,
                request.fromId
              );
            }
            return (
              <Card>
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
                      }}
                    >
                      {user.nickname}{" "}
                    </Button>{" "}
                    for {foundRequest ? foundRequest.name : null}
                  </Typography>
                  <div id="profile-popover">
                    <Popover
                      style={{
                        height: "500px",
                        width: "500px",
                        padding: "15px",
                        borderRadius: "10px"
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
                      <ProfilePopover />
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
              </Card>
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
