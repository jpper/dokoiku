import firebase from "firebase";
import React, { Component } from "react";
// import ReactLoading from "react-loading";
// import { withRouter } from "react-router-dom";
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
import "../styles/Login.css";

const mapStateToProps = (state: any) => ({
  userName: state.userName,
  userId: state.userId,
  userPhoto: state.userPhoto
});

const mapDispatchToProps = (dispatch: any) => ({
  login: () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    // this.setState({ isLoading: true });
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
                photoUrl: userResult.photoURL
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
            // Write user info to local
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
    dispatch(setUserInfo(userName, userId, userPhoto))
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
      this.props.setUserInfo(user.displayName, user.uid, user.photoURL);
    });
  };

  onlogoutPress = () => {
    this.props.setUserInfo("", "", "");
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
                        SIGN OUT WITH GOOGLE
                      </Button>
                      <div>{this.props.userName}</div>
                    </div>
                  ) : (
                    <div className="buttonWrapper">
                      <Button
                        className="button"
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={this.props.login}
                      >
                        <MailIcon />
                        &nbsp; Sign In with &nbsp;
                        <b>Google</b>
                      </Button>
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
