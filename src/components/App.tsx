import React from "react";
import TripInfo from "./TripInfo";
import Profile from "./Profile";
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
};

class App extends React.Component<myProps, {}> {
  render() {
    return (
      <div className="App">
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
    showProfile: state.showProfile
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowChat: () =>
      dispatch({
        type: "SHOW_CHAT"
      }),
    onShowProfile: () =>
      dispatch({
        type: "SHOW_PROFILE"
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
