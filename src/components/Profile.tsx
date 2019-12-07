import React from "react";
import { connect } from "react-redux";

type myProps = {
  trips: any;
  currentTripIndex: number;
  currentProfile: number;
  onClosePopup: any;
};

class Profile extends React.Component<myProps, {}> {
  render() {
    return (
      <div className="Profile">
        <img
          src={
            this.props.trips[this.props.currentTripIndex].members[
              this.props.currentProfile
            ].propic
          }
          alt="fb-propic"
        />
        <p>
          Name:{" "}
          {
            this.props.trips[this.props.currentTripIndex].members[
              this.props.currentProfile
            ].name
          }
        </p>
        <button onClick={this.props.onClosePopup}>Close</button>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTripIndex: state.currentTripIndex,
    currentProfile: state.currentProfile
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onClosePopup: () =>
      dispatch({
        type: "CLOSE_POPUP"
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
