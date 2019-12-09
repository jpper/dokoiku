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

class Profile extends React.Component<
  myProps,
  { nickname: string; photo: string }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      nickname: null,
      photo: null
    };
  }

  async componentWillMount() {
    const memberId = this.props.trips[this.props.currentTripIndex].memberIds[
      this.props.currentProfile
    ];
    const nickname = await myFirestore
      .collection("users")
      .doc(memberId)
      .get()
      .then(doc => doc.data().nickname);

    const photo = await myFirestore
      .collection("users")
      .doc(memberId)
      .get()
      .then(doc => doc.data().photoUrl);
    this.setState({ nickname: nickname, photo: photo });
  }

  componentDidMount() {
    console.log(this.props.currentProfile);
    console.log(this.props.trips[this.props.currentTripIndex].memberIds[0]);
  }

  render() {
    console.log(this.props.trips[this.props.currentTripIndex].memberIds);
    return (
      <div className="Profile">
        <img src={this.state.photo} alt={this.state.nickname} />
        <p>
          {this.state.nickname}
          {/* {myFirestore
            .collection("users")
            .doc(
              this.props.trips[this.props.currentTripIndex].memberIds[
                this.props.currentProfile
              ]
            )
            .get()
            .then(doc => console.log("DOC", doc.data()))} */}
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
