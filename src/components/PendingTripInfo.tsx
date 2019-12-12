import React from "react";
import { connect } from "react-redux";
import { myFirestore } from "../config/firebase";

// Material UI and styling
import "../styles/Modal.css";
import { Card, Typography, CardContent } from "@material-ui/core";
import "../styles/TripInfo.css";

type myProps = {
  pendingTrips: any;
  userId: string;
};

class PendingTripInfo extends React.Component<myProps, {}> {
  render() {
    return (
      <div>
        {this.props.pendingTrips.length ? (
          this.props.pendingTrips.map((trip: any) => (
            <Card>
              <CardContent>
                <Typography>{trip.name}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <div>You don't have any pending trips.</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    pendingTrips: state.pendingTrips
  };
};

export default connect(mapStateToProps)(PendingTripInfo);
