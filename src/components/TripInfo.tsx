import React from "react";
import { connect } from "react-redux";

// type TripInfoProps = {
//   name: string;
//   URL: string;
// };

class TripInfo extends React.Component {
  render() {
    return (
      <div className="TripInfo">
        <h1>Trip Details</h1>
        <p>Start Date: </p>
        <p>End Date: </p>
        <p>Locations: </p>
        <p>Budget: </p>
        <p>Notes: </p>
        <p>Members: </p>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTrip: state.currentTrip
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    showChat: () =>
      dispatch({
        type: "SHOW_CHAT"
      }),
    showProfile: () =>
      dispatch({
        type: "SHOW_PROFILE"
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TripInfo);
