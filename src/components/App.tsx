import React from "react";

import Profile from "./Profile";

import { myFirestore } from "../config/firebase";
import "../styles/App.css";

import Contents from "./Contents";
import { connect } from "react-redux";

type myProps = {
  userId: string;
  userName: string;
  userPhoto: string;
  currentTripMemberInfo: any;
  currentTripMessages: any;
  ongoingTrips: any;
  searchTrips: any;
  currentOngoingTripIndex: number;
  currentSearchTripIndex: number;
  showChat: boolean;
  showProfile: boolean;
  showBuild: boolean;
  onShowChat?: any;
  onShowProfile?: any;
  onShowBuild?: any;
  currentProfile: number;
};

class App extends React.Component<myProps, {}> {
  render() {
    return (
      <div className="App">
        {/* <BuildTrip /> */}
        <Contents />
        {/* <Notes tripId="TestTrip1" /> */}
        {/* {this.props.userId.length && this.props.trips.length ? (
          <ChatBoard />
        ) : null} */}
        {/* {this.props.trips.length &&
        this.props.currentTripIndex !== undefined ? (
          <TripInfo />
        ) : null} */}

        {this.props.showProfile ? <Profile /> : null}
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
    ongoingTrips: state.ongoingTrips,
    searchTrips: state.searchTrips,
    currentOngoingTripIndex: state.currentOngoingTripIndex,
    currentSearchTripIndex: state.currentSearchTripIndex,
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
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
