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
import firebase from "firebase";

type myProps = {
  requests: any;
  users: any;
  ongoingTrips: any;
  userId: string;
};

const mapStateToProps = (state: any) => {
  return {
    requests: state.requests,
    users: state.users,
    ongoingTrips: state.ongoingTrips,
    userId: state.userId
  };
};

class Notification extends React.Component<myProps, any> {
  acceptRequest = (ownerId: string, tripId: string, fromId: string) => {
    myFirestore
      .collection("users")
      .doc(ownerId)
      .collection("requests")
      .doc(fromId + tripId)
      .delete();
    myFirestore
      .collection("trips")
      .doc(tripId)
      .update({
        memberIds: firebase.firestore.FieldValue.arrayUnion(fromId)
      });
  };
  rejectRequest = (ownerId: string, tripId: string, fromId: string) => {
    myFirestore
      .collection("users")
      .doc(ownerId)
      .collection("requests")
      .doc(fromId + tripId)
      .delete();
  };
  render() {
    console.log(this.props.ongoingTrips);
    return (
      <div>
        <Card>
          {this.props.requests.length ? (
            this.props.requests.map((request: any) => (
              <div>
                <CardContent>
                  <Typography>
                    You have a request from{" "}
                    {
                      this.props.users.find(
                        (user: any) => user.id === request.fromId
                      ).nickname
                    }{" "}
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
                    onClick={() =>
                      this.acceptRequest(
                        this.props.userId,
                        request.tripId,
                        request.fromId
                      )
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() =>
                      this.rejectRequest(
                        this.props.userId,
                        request.tripId,
                        request.fromId
                      )
                    }
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

export default connect(mapStateToProps)(Notification);
