import React from "react";
import { connect } from "react-redux";

type myProps = {
  trips: any;
  currentTrip: number;
};

class Profile extends React.Component<myProps, {}> {
  render() {
    return (
      <div className="Profile">
        <img
          src={this.props.trips[this.props.currentTrip].members[0].propic}
          alt="fb-propic"
        />
        <p>Name: {this.props.trips[this.props.currentTrip].members[0].name}</p>
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

export default connect(mapStateToProps)(Profile);
