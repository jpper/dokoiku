import React from "react";
import Login from "./Login";
import TripInfo from "./TripInfo";
import BuildTrip from "./BuildTrip";
import Profile from "./Profile";
import ChatBoard from "./ChatBoard";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import "../styles/App.css";
import Map from "./Map";
import { connect } from "react-redux";
import { getHeapSnapshot } from "v8";
import { setTrips } from "../redux/action";

type myProps = {
  userId: string;
  userName: string;
  userPhoto: string;
  currentTripMemberInfo: any;
  currentTripMessages: any;
  trips: any;
  currentTrip: number;
  getTrips: any;
  showChat: boolean;
  showProfile: boolean;
  showBuild: boolean;
  onShowChat?: any;
  onShowProfile?: any;
  onShowBuild?: any;
  currentProfile: number;
};

class App extends React.Component<myProps, {}> {
  componentDidMount() {
    this.props.getTrips();
  }
  render() {
    return (
      <div className="App">
        <Login />
        {/* <BuildTrip /> */}
        {this.props.trips.length ? <ChatBoard /> : null}
        <TripInfo />
        {this.props.showProfile ? <Profile /> : null} */}
        {/* <Map /> */}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    userName: state.userNames,
    userPhoto: state.userPhoto,
    currentTripMemberInfo: state.currentTripMemberInfo,
    currentTripMessages: state.currentTripMessages,
    trips: state.trips,
    currentTrip: state.currentTrip,
    showChat: state.showChat,
    showProfile: state.showProfile,
    showBuild: state.showBuild,
    currentProfile: state.currentProfile
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowChat: () =>
      dispatch({
        type: "SHOW_CHAT"
      }),
    onShowProfile: (index: number) =>
      dispatch({
        type: "SHOW_PROFILE",
        index
      }),
    onShowBuild: (index: number) =>
      dispatch({
        type: "SHOW_BUILD",
        index
      }),
    getTrips: () => {
      myFirestore
        .collection("trips")
        .get()
        .then(snapShot => {
          const trips = snapShot.docs.map(doc => doc.data());
          console.log(trips);
          dispatch(setTrips(trips));
        })
        .catch(err => {
          console.log(err.toString());
        });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
