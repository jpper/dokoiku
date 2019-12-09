import React from "react";
import Login from "./Login";
import AllTripInfo from "./AllTripInfo";
import BuildTrip from "./BuildTrip";
import Profile from "./Profile";
import ChatBoard from "./ChatBoard";
import { myFirestore } from "../config/firebase";
import "../styles/App.css";
import Map from "./Map";
import Notes from "./Notes";
import Contents from "./Contents";
import { connect } from "react-redux";

type myProps = {
  userId: string;
  userName: string;
  userPhoto: string;
  currentTripMemberInfo: any;
  currentTripMessages: any;
  trips: any;
  currentTripIndex: number;
  getTrips: any;
  showChat: boolean;
  showProfile: boolean;
  showBuild: boolean;
  onShowChat?: any;
  onShowProfile?: any;
  onShowBuild?: any;
  currentProfile: number;
};

class App extends React.Component<myProps, { nicknames: any; photos: any }> {
  componentDidMount() {
    this.props.getTrips();
  }

  // getNamesAndPhotos = async () => {
  //   const populatedNicknames: any = [];
  //   const populatedPhotos: any = [];
  //   this.props.trips[this.props.currentTripIndex].memberIds.forEach(
  //     async (m: any) => {
  //       const username = await myFirestore
  //         .collection("users")
  //         .doc(m)
  //         .get()
  //         .then(doc => doc.data().nickname);
  //       populatedNicknames.push(username);
  //       const photo = await myFirestore
  //         .collection("users")
  //         .doc(m)
  //         .get()
  //         .then(doc => doc.data().photoUrl);
  //       populatedPhotos.push(photo);
  //     }
  //   );
  //   this.setState({ nicknames: populatedNicknames, photos: populatedPhotos });
  // };

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
    trips: state.trips,
    currentTripIndex: state.currentTripIndex,
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
      //console.log("called");
      myFirestore.collection("trips").onSnapshot(snapShot => {
        snapShot.docChanges().forEach(change => {
          if (change.type === "added") {
            //console.log(change.doc.data());
            dispatch({ type: "ADD_TRIP", trip: change.doc.data() });
          }
        });
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
