import React from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";

type myProps = {
  trips: any;
  currentTripIndex: number;
  currentProfile: number;
  onClosePopup: any;
};

class Profile extends React.Component<myProps, {}> {
  componentDidMount() {
    console.log(this.props.trips[this.props.currentTripIndex].memberIds[0]);
  }

  render() {
    return (
      <div className="Profile">
        <img
          src={
            this.props.trips[this.props.currentTripIndex].memberIds[
              this.props.currentProfile
            ].propic
          }
          alt="TBD"
        />
        <p>
          Name: TBD
          {/* {myFirestore
            .collection("users")
            .doc(
              this.props.trips[this.props.currentTripIndex].memberIds[
                this.props.currentProfile
              ]
            )
            .get()
            .then(doc => console.log("DOC", doc))} */}
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
