import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography
} from "@material-ui/core";
import { myFirestore } from "../config/firebase";
import { removeRequest } from "../redux/action";
import firebase from "firebase";

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

  render() {
    //console.log(this.props.requests);
    return (
      <div>
        <Card>
          {this.props.requests.length ? (
            this.props.requests.map((request: any) => (
              <div>
                <CardContent>
                  <Typography>
                    You have a request from{" "}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        this.props.onChangeDisplayProfile(request.fromId)
                      }
                    >
                      {
                        this.props.users.find(
                          (user: any) => user.id === request.fromId
                        ).nickname
                      }{" "}
                    </Button>
                    for{" "}
                    {
                      this.props.ongoingTrips.find(
                        (trip: any) => trip.tripId === request.tripId
                      ).name
                    }
                  </Typography>
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
            ))
          ) : (
            <div>You don't have any notifications.</div>
          )}
        </Card>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
