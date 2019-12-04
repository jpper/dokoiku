import React from "react";
import { connect } from "react-redux";

// type ProfileProps = {
//   name: string;
//   URL: string;
// };

class Profile extends React.Component {
  render() {
    return (
      <div className="Profile">
        <img
          src="https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"
          alt="fb-propic"
        />
        {/* make image src image info */}
        <p>Name: </p> {/* populate with name info */}
        <p>Facebook: </p> {/* populate with FB link */}
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
