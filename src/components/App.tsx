import React from "react";
import Login from "./Login";
import TripInfo from "./TripInfo";
import Profile from "./Profile";
import ChatBoard from "./ChatBoard";
import "../styles/App.css";
import Map from "./Map";
import { connect } from "react-redux";

type myProps = {
  trips: any;
  currentTrip: number;
  showChat: boolean;
  showProfile: boolean;
  onShowChat?: any;
  onShowProfile?: any;
  currentProfile: number;
};

class App extends React.Component<myProps, {}> {
  render() {
    return (
      <div className="App">
        <Login />
        <ChatBoard />
        <TripInfo />
        {this.props.showProfile ? <Profile /> : null}
        <Map />
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    trips: state.trips,
    currentTrip: state.currentTrip,
    showChat: state.showChat,
    showProfile: state.showProfile,
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
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
