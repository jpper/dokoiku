import React from "react";
import { connect } from "react-redux";
import OngoingTripInfo from "./OngoingTripInfo";
import SearchTripInfo from "./SearchTripInfo";
import Map from "./Map";
import Notes from "./Notes";
import ChatBoard from "./ChatBoard";
import About from "./About";
import BuildTrip from "./BuildTrip";
import EditTrip from "./EditTrip";
import Login from "./Login";
import Notification from "./Notification";

import MyProfile from "./MyProfile";
import Profile from "./Profile";
import firebase from "firebase";
import { myFirestore } from "../config/firebase";
import {
  setUserInfo,
  addRequest,
  addPendingTrip,
  setShowReviews,
  addPastTrip,
  setPageTabIndex,
  setUserCurrencyCode
} from "../redux/action";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

// Material UI & Styles
import "../styles/App.css";
import {
  AppBar,
  Typography,
  IconButton,
  Tab,
  Tabs,
  Box,
  Grid,
  Avatar,
  Menu,
  Card,
  Container,
  Badge,
  Button
} from "@material-ui/core";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import SearchIcon from "@material-ui/icons/Search";
import BuildIcon from "@material-ui/icons/Build";
import InfoIcon from "@material-ui/icons/Info";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

// import ChatIcon from "@material-ui/icons/Chat";
import RateReviewIcon from "@material-ui/icons/RateReview";
import PastTripInfo from "./PastTripInfo";

import PersonIcon from "@material-ui/icons/Person";
import backgroundImg from "../img/trip.jpg";
import moment from "moment";
import PrivacyPolicy from "./PrivacyPolicy";
import iconImg from "../img/logo-dokoiku.png";
import iconImgWhite from "../img/logo-dokoiku-title-white.png";
import { User, Trip, Waypoint, Request } from "../redux/stateTypes";

type myProps = {
  userId: string;
  userName: string;
  userPhoto: string;
  ongoingTrips: Trip[];
  searchTrips: Trip[];
  pastTrips: Trip[];
  currentOngoingTripIndex: number;
  currentSearchTripIndex: number;
  currentPastTripIndex: number;
  showChat: boolean;
  showEdit: boolean;
  onShowChat?: () => void;
  currentProfile: number;
  setUserInfo: (userName: string, userId: string, userPhoto: string) => void;
  mapTripMessage: number;
  getTrips: (userId: string) => void;
  getRequests: (userId: string) => void;
  requests: Request[];
  logout: () => void;
  displayProfile: string;
  pageTabIndex: number;
  setPageTabIndex: (index: number) => void;
  getUserCurrencyCode: (userId: string) => void;
};

type myState = {
  anchorEl: any;
};

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    userName: state.userName,
    userPhoto: state.userPhoto,
    ongoingTrips: state.ongoingTrips,
    searchTrips: state.searchTrips,
    pastTrips: state.pastTrips,
    currentOngoingTripIndex: state.currentOngoingTripIndex,
    currentSearchTripIndex: state.currentSearchTripIndex,
    currentPastTripIndex: state.currentPastTripIndex,
    showChat: state.showChat,
    showEdit: state.showEdit,
    currentProfile: state.currentProfile,
    mapTripMessage: state.mapTripMessage,
    requests: state.requests,
    displayProfile: state.displayProfile,
    pageTabIndex: state.pageTabIndex
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setUserInfo: (userName: string, userId: string, userPhoto: string) =>
    dispatch(setUserInfo(userName, userId, userPhoto)),
  getTrips: async (userId: string) => {
    const tripIds: string[] = [];
    myFirestore
      .collection("users")
      .doc(userId)
      .collection("pendingTrips")
      .onSnapshot(snapShot => {
        snapShot.docChanges().forEach(change => {
          if (change.type === "added") {
            tripIds.push(change.doc.data().tripId);
          }
        });
      });

    myFirestore.collection("trips").onSnapshot(snapShot => {
      snapShot.docChanges().forEach(change => {
        if (change.type === "added") {
          if (change.doc.data().memberIds.indexOf(userId) === -1) {
            if (tripIds.includes(change.doc.data().tripId)) {
              dispatch(addPendingTrip(change.doc.data()));
            } else {
              const today = new Date();
              // Dispatch ADD_PAST_TRIP here!
              if (
                today.getTime() <
                change.doc
                  .data()
                  .startDate.toDate()
                  .getTime()
              ) {
                dispatch({
                  type: "ADD_SEARCH_TRIP",
                  searchTrip: change.doc.data()
                });
              }
            }
          } else {
            const today = new Date();
            // Dispatch ADD_PAST_TRIP here!
            if (
              today.getTime() >
              change.doc
                .data()
                .endDate.toDate()
                .getTime()
            ) {
              dispatch(addPastTrip(change.doc.data()));
            } else {
              dispatch({
                type: "ADD_ONGOING_TRIP",
                ongoingTrip: change.doc.data()
              });
            }
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
  setShowReviews: (status: boolean) => {
    dispatch(setShowReviews(status));
  },
  getRequests: async (userId: string) => {
    myFirestore
      .collection("users")
      .doc(userId)
      .collection("requests")
      .onSnapshot(snapShot => {
        snapShot.docChanges().forEach(change => {
          if (change.type === "added") {
            dispatch(addRequest(change.doc.data()));
          }
        });
      });
  },
  logout: () => dispatch({ type: "LOGOUT" }),
  setPageTabIndex: (index: number) => {
    dispatch(setPageTabIndex(index));
    dispatch({
      type: "CHANGE_DISPLAY_PROFILE",
      displayProfile: undefined
    });
  },
  getUserCurrencyCode: (userId: string) => {
    myFirestore
      .collection("users")
      .doc(userId)
      .get()
      .then((response: any) => {
        if (response.data().currencyCode)
          dispatch(setUserCurrencyCode(response.data().currencyCode));
        else dispatch(setUserCurrencyCode("None"));
      });
  }
});

interface TabPanelProps {
  children?: React.ReactNode;
  index?: number;
  value?: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} className="tabPanel">
          {children}
        </Box>
      )}
    </Typography>
  );
}

class App extends React.Component<myProps, myState> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      anchorEl: null
    };
  }
  componentDidMount() {
    this.checkLogin();
  }

  componentWillUpdate() {
    if (this.props.pageTabIndex === -1) {
      this.props.setPageTabIndex(0);
    }
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user !== null) {
        const userData = await myFirestore
          .collection("users")
          .doc(user.uid)
          .get();

        this.props.setUserInfo(
          user.displayName,
          user.uid,
          userData.data().photoUrl
        );
        this.props.getTrips(user.uid);
        this.props.getRequests(user.uid);
        this.props.getUserCurrencyCode(user.uid);
      }
    });
  };

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    // Change the target tab
    this.props.setPageTabIndex(newValue);
    this.setState({
      anchorEl: null
    });
  };

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  onLogin = () => {
    this.handleClose();
    this.props.setPageTabIndex(-1);
  };

  onLogout = () => {
    this.handleClose();
    this.props.setUserInfo("", "", "");
    firebase.auth().signOut();
    this.props.logout();
  };

  render() {
    return (
      <Router>
        <Route
          exact={true}
          path="/"
          render={() => {
            return (
              <div className="contents">
                <AppBar position="static">
                  <Tabs
                    value={this.props.pageTabIndex}
                    onChange={this.handleChange}
                    variant="scrollable"
                    className="tabs"
                    textColor="secondary"
                    scrollButtons="on"
                    aria-label="scrollable force tabs example"
                  >
                    <Tab label="About" icon={<InfoIcon />} />
                    <Tab label="Profile" icon={<PersonIcon />} />
                    <Tab label="Upcoming Trips" icon={<CardTravelIcon />} />
                    <Tab label="Search Trips" icon={<SearchIcon />} />
                    <Tab label="Build Trip" icon={<BuildIcon />} />
                    <Tab label="Past Trips" icon={<RateReviewIcon />} />

                    {/* User Icon */}
                    <div className="iconWrapper">
                      <IconButton
                        color="inherit"
                        aria-controls="personalMenu"
                        aria-haspopup="true"
                        onClick={this.handleClick}
                      >
                        {this.props.requests.length ? (
                          <Badge
                            badgeContent={this.props.requests.length}
                            color="secondary"
                          >
                            {this.props.userPhoto === "" ? (
                              <>
                                <AccountCircleIcon fontSize="large" />
                              </>
                            ) : (
                              <>
                                <Avatar
                                  alt="User Photo"
                                  src={this.props.userPhoto}
                                />
                              </>
                            )}
                          </Badge>
                        ) : (
                          <div>
                            {this.props.userPhoto === "" ? (
                              <>
                                <AccountCircleIcon fontSize="large" />
                              </>
                            ) : (
                              <>
                                <Avatar
                                  alt="User Photo"
                                  src={this.props.userPhoto}
                                />
                              </>
                            )}
                          </div>
                        )}
                      </IconButton>
                      <Menu
                        className="userMenu"
                        id="personalMenu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                      >
                        {this.props.userId === "" ? (
                          <>
                            <p className="textUsername">
                              Hello, <b>Anonymous</b>
                            </p>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={this.onLogin}
                            >
                              Login
                            </Button>
                          </>
                        ) : (
                          <>
                            <p className="textUsername">
                              Hello, <b>{this.props.userName}</b>
                            </p>
                            <Notification />
                            <br />
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              onClick={this.onLogout}
                            >
                              Logout
                            </Button>
                          </>
                        )}
                      </Menu>
                    </div>

                    {/* App Title */}
                    <img
                      src={iconImgWhite}
                      className="iconImgSmall"
                      alt="Dokoiku logo"
                    ></img>
                  </Tabs>

                  {/* My Profile */}
                  <TabPanel value={this.props.pageTabIndex} index={1}>
                    {this.props.userId === "" ? (
                      <Login />
                    ) : (
                      <>
                        <Grid container>
                          <Grid item sm={3}></Grid>
                          <Grid item xs={12} sm={6}>
                            <Card>
                              <MyProfile />
                            </Card>
                          </Grid>
                          <Grid item sm={3}></Grid>
                        </Grid>
                      </>
                    )}

                    <div className="iconImg-container">
                      <img
                        src={iconImg}
                        className="iconImg"
                        alt="Dokoiku logo"
                      ></img>
                    </div>
                  </TabPanel>

                  {/* Upcoming Trips */}
                  <TabPanel value={this.props.pageTabIndex} index={2}>
                    {this.props.userId === "" ? (
                      <Login />
                    ) : (
                      <>
                        {this.props.ongoingTrips.length ? (
                          <Grid container>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={3}>
                              <Container>
                                <Card className="tripInfo">
                                  <OngoingTripInfo />
                                </Card>
                              </Container>
                            </Grid>
                            {/* {if statement and changing props value here} */}
                            <Grid item xs={12} sm={8} md={8} lg={8} xl={9}>
                              {this.props.displayProfile ? (
                                <Profile />
                              ) : (
                                !this.props.showChat &&
                                !this.props.showEdit &&
                                this.props.ongoingTrips.length &&
                                this.props.mapTripMessage === 0 && (
                                  <Map
                                    trips={this.props.ongoingTrips}
                                    currentTripIndex={
                                      this.props.currentOngoingTripIndex
                                    }
                                  />
                                )
                              )}
                              {this.props.mapTripMessage === 1 && (
                                <Notes
                                  tripId={
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].tripId
                                  }
                                />
                              )}
                              {this.props.mapTripMessage === 2 && (
                                <ChatBoard
                                  tripId={this.props.ongoingTrips[
                                    this.props.currentOngoingTripIndex
                                  ].tripId.trim()}
                                />
                              )}

                              {this.props.showEdit ? (
                                <EditTrip
                                  name={
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].name
                                  }
                                  startDate={moment(
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].startDate.toDate()
                                  ).format("YYYY-MM-DD")}
                                  endDate={moment(
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].endDate.toDate()
                                  ).format("YYYY-MM-DD")}
                                  startLocation={
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].startLocation
                                  }
                                  budget={
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].budget
                                  }
                                  waypoints={
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].waypoints
                                  }
                                  tripId={
                                    this.props.ongoingTrips[
                                      this.props.currentOngoingTripIndex
                                    ].tripId
                                  }
                                />
                              ) : null}
                            </Grid>
                          </Grid>
                        ) : (
                          <div>Please join a trip or create your own.</div>
                        )}
                      </>
                    )}

                    <div className="iconImg-container">
                      <img
                        src={iconImg}
                        className="iconImg"
                        alt="Dokoiku logo"
                      ></img>
                    </div>
                  </TabPanel>

                  {/* Search Trip */}
                  <TabPanel value={this.props.pageTabIndex} index={3}>
                    {this.props.userId === "" ? (
                      <Login />
                    ) : (
                      <>
                        {this.props.searchTrips.length ? (
                          <Grid container>
                            <Grid item xs={12} sm={4} md={4} lg={4} xl={3}>
                              <Container>
                                <Card className="tripInfo">
                                  <SearchTripInfo />
                                </Card>
                              </Container>
                            </Grid>
                            <Grid item xs={12} sm={8} md={8} lg={8} xl={9}>
                              {this.props.displayProfile ? (
                                <Profile />
                              ) : (
                                <Map
                                  trips={this.props.searchTrips}
                                  currentTripIndex={
                                    this.props.currentSearchTripIndex
                                  }
                                />
                              )}
                            </Grid>
                          </Grid>
                        ) : (
                          <div>There are no new trips available.</div>
                        )}
                      </>
                    )}

                    <div className="iconImg-container">
                      <img
                        src={iconImg}
                        className="iconImg"
                        alt="Dokoiku logo"
                      ></img>
                    </div>
                  </TabPanel>

                  {/* Build Trip */}
                  <TabPanel value={this.props.pageTabIndex} index={4}>
                    {this.props.userId === "" ? (
                      <Login />
                    ) : (
                      <>
                        <Grid
                          container
                          alignContent="center"
                          alignItems="center"
                          justify="center"
                        >
                          <Grid item sm={4} md={4} lg={4} xl={5}></Grid>
                          <Grid item xs={12} sm={4} md={4} lg={4} xl={2}>
                            <BuildTrip />
                          </Grid>
                          <Grid item sm={4} md={4} lg={4} xl={5}></Grid>
                        </Grid>
                      </>
                    )}

                    <div className="iconImg-container">
                      <img
                        src={iconImg}
                        className="iconImg"
                        alt="Dokoiku logo"
                      ></img>
                    </div>
                  </TabPanel>

                  {/* Reviews */}
                  <TabPanel value={this.props.pageTabIndex} index={5}>
                    {this.props.userId === "" ? (
                      <Login />
                    ) : (
                      <>
                        <PastTripInfo />
                      </>
                    )}

                    <div className="iconImg-container">
                      <img
                        src={iconImg}
                        className="iconImg"
                        alt="Dokoiku logo"
                      ></img>
                    </div>
                  </TabPanel>

                  {/* About */}
                  {this.props.pageTabIndex === 0 && (
                    <div>
                      <img
                        className="bgImg"
                        src={backgroundImg}
                        alt="backImg"
                      />
                      <About />
                    </div>
                  )}
                </AppBar>

                {/* Click Login */}
                {this.props.pageTabIndex === -1 && (
                  <div style={{ marginTop: "35px" }}>
                    <Login />
                  </div>
                )}

                {/* Privacy policy */}
                {this.props.pageTabIndex === 0 ? (
                  <Link to="/privacy">
                    <Button
                      variant="outlined"
                      size="small"
                      id="privacy-policy-about"
                    >
                      Privacy Policy
                    </Button>
                  </Link>
                ) : (
                  <Link to="/privacy">
                    <Button variant="outlined" size="small" id="privacy-policy">
                      Privacy Policy
                    </Button>
                  </Link>
                )}
              </div>
            );
          }}
        />
        <Route path="/privacy" component={PrivacyPolicy} />
      </Router>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
