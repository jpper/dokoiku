import firebase from "firebase";
import React, { Component } from "react";
import { myFirebase, myFirestore } from "../config/firebase";
import { setUserInfo } from "../redux/action";
import { connect } from "react-redux";

// Material UI & Styles
import {
  Avatar,
  Container,
  Paper,
  Typography,
  Grid,
  Button
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import MailIcon from "@material-ui/icons/Mail";
import FacebookIcon from "@material-ui/icons/Facebook";
import "../styles/Login.css";

const mapStateToProps = (state: any) => ({
  userName: state.userName,
  userId: state.userId,
  userPhoto: state.userPhoto
});

const mapDispatchToProps = (dispatch: any) => ({
  login: (provider: any) => {
    myFirebase
      .auth()
      .signInWithPopup(provider)
      .then(async result => {
        let userResult = result.user;
        if (userResult) {
          const result = await myFirestore
            .collection("users")
            .where("id", "==", userResult.uid)
            .get();

          if (result.docs.length === 0) {
            // Set new data since this is a new user
            myFirestore
              .collection("users")
              .doc(userResult.uid)
              .set({
                id: userResult.uid,
                nickname: userResult.displayName,
                aboutMe: "",
                photoUrl: userResult.photoURL,
                currencyCode: "JPY"
              })
              .then(data => {
                // Write user info to local
                dispatch(
                  setUserInfo(
                    userResult.displayName,
                    userResult.uid,
                    userResult.photoURL
                  )
                );
              });
          } else {
            // update user info everytime
            myFirestore
              .collection("users")
              .doc(userResult.uid)
              .update({
                nickname: userResult.displayName,
                photoUrl: userResult.photoURL
              })
              .then(res => {
                console.log("Update User info");
              });

            dispatch(
              setUserInfo(
                userResult.displayName,
                userResult.uid,
                userResult.photoURL
              )
            );
          }
        } else {
          console.log("User info not available");
        }
      })
      .catch(err => {
        console.log(err.message);
      });
  },
  setUserInfo: (userName: string, userId: string, userPhoto: string) =>
    dispatch(setUserInfo(userName, userId, userPhoto)),
  getTrips: async (userId: string) => {
    myFirestore.collection("trips").onSnapshot(snapShot => {
      snapShot.docChanges().forEach(change => {
        if (change.type === "added") {
          if (change.doc.data().memberIds.indexOf(userId) === -1) {
            console.log("dispatching ADD_SEARCH_TRIP");
            dispatch({
              type: "ADD_SEARCH_TRIP",
              searchTrip: change.doc.data()
            });
          } else {
            console.log("dispatching ADD_ONGOING_TRIP");
            dispatch({
              type: "ADD_ONGOING_TRIP",
              ongoingTrip: change.doc.data()
            });
          }
        }
      });
    });
    const users = await myFirestore
      .collection("users")
      .get()
      .then(query => query.docs.map(user => user.data()));
    dispatch({ type: "GET_USERS", users });
  },
  logout: () => dispatch({ type: "LOGOUT" })
});

interface Status {
  isLoading: boolean;
  user: firebase.User | null;
  uid: string;
  displayName: string;
  photoURL: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Login extends Component<Props, Status> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      user: null,
      uid: "",
      displayName: "",
      photoURL: ""
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        this.props.setUserInfo(user.displayName, user.uid, user.photoURL);
        this.props.getTrips(user.uid);
      }
    });
  };

  onLogin4Google = () => {
    this.props.login(new firebase.auth.GoogleAuthProvider());
  };

  onLogin4Facebook = () => {
    this.props.login(new firebase.auth.FacebookAuthProvider());
  };

  onlogoutPress = () => {
    this.props.setUserInfo("", "", "");
    this.props.logout();
    firebase.auth().signOut();
  };

  render() {
    return (
      <div className="container">
        <Container>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={6}>
              <Paper>
                <div className="wrapper">
                  <div className="titleWrapper">
                    <Avatar>
                      <LockIcon />
                    </Avatar>
                    <Typography variant="h5" className="header">
                      Sign in
                    </Typography>
                  </div>

                  {this.props.userName ? (
                    <div className="buttonWrapper">
                      <Button
                        className="button"
                        variant="contained"
                        color="secondary"
                        type="submit"
                        onClick={this.onlogoutPress}
                      >
                        SIGN OUT
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Grid container>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={10} className="buttonWrapper">
                          {/* Google */}
                          <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            onClick={this.onLogin4Google}
                          >
                            <MailIcon />
                            &nbsp; Sign In with &nbsp;
                            <b>Google</b>
                          </Button>
                        </Grid>
                        <Grid item xs={1}></Grid>

                        <Grid item xs={1}></Grid>
                        <Grid item xs={10} className="buttonWrapper">
                          {/* Facebook */}
                          <Button
                            className="button"
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            onClick={this.onLogin4Facebook}
                          >
                            <FacebookIcon />
                            &nbsp; Sign In with &nbsp;
                            <b>Facebook</b>
                          </Button>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </Grid>
                    </div>
                  )}

                  {this.state.isLoading ? (
                    <div className="viewLoading">
                      {/* <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            /> */}
                    </div>
                  ) : null}
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
