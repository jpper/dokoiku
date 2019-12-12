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
import firebase from "firebase";
import { myFirestore } from "../config/firebase";
import { setUserInfo } from "../redux/action";
import MyProfile from "./MyProfile";

// Material UI & Styles
import "../styles/App.css";
import "../styles/AddFacebook.css";
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
  MenuItem,
  Card,
  Container
} from "@material-ui/core";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import SearchIcon from "@material-ui/icons/Search";
import BuildIcon from "@material-ui/icons/Build";
import InfoIcon from "@material-ui/icons/Info";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PersonIcon from "@material-ui/icons/Person";
import backgroundImg from "../img/trip.jpg";
import moment from "moment";

type myProps = {
  userId: string;
  userName: string;
  userPhoto: string;
  ongoingTrips: any;
  searchTrips: any;
  currentOngoingTripIndex: number;
  currentSearchTripIndex: number;
  showChat: boolean;
  showEdit: boolean;
  onShowChat?: any;
  currentProfile: number;
  setUserInfo: any;
  login: any;
  mapTripMessage: any;
  getTrips: any;
};

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    userName: state.userName,
    userPhoto: state.userPhoto,
    ongoingTrips: state.ongoingTrips,
    searchTrips: state.searchTrips,
    currentOngoingTripIndex: state.currentOngoingTripIndex,
    currentSearchTripIndex: state.currentSearchTripIndex,
    showChat: state.showChat,
    showEdit: state.showEdit,
    currentProfile: state.currentProfile,
    mapTripMessage: state.mapTripMessage,
    login: state.login
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setUserInfo: (userName: string, userId: string, userPhoto: string) =>
    dispatch(setUserInfo(userName, userId, userPhoto)),
  getTrips: async (userId: string) => {
    //console.log("called");
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
  }
});

interface TabPanelProps {
  children?: React.ReactNode;
  index?: any;
  value?: any;
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

// type Props = ReturnType<typeof mapStateToProps> &
//   ReturnType<typeof mapDispatchToProps>;

class App extends React.Component<myProps, any> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      value: 1
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  componentWillUpdate() {
    if (this.state.value === -1) {
      this.setState({
        value: 0
      });
    }
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        this.props.setUserInfo(user.displayName, user.uid, user.photoURL);
        this.props.getTrips(user.uid);
      }
    });
  };

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    // Change the target tab
    this.setState({
      value: newValue,
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
    this.setState({
      value: -1
    });
  };

  onLogout = () => {
    this.handleClose();
    this.props.setUserInfo("", "", "");
    firebase.auth().signOut();
    console.log("LOGOUT!!!");
  };

  render() {
    return (
      <div className="contents">
        <AppBar position="static">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            centered
            aria-label="scrollable force tabs example"
          >
            <Tab label="About" icon={<InfoIcon />} />
            <Tab label="Profile" icon={<PersonIcon />} />
            <Tab label="Ongoing Trips" icon={<CardTravelIcon />} />
            <Tab label="Search Trips" icon={<SearchIcon />} />
            <Tab label="Build Trip" icon={<BuildIcon />} />
            {/* <Tab label="Social" icon={<ChatIcon />} /> */}

            {/* User Icon */}
            <div className="iconWrapper">
              <IconButton
                color="inherit"
                aria-controls="personalMenu"
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                {this.props.userPhoto === "" ? (
                  <>
                    <AccountCircleIcon fontSize="large" />
                  </>
                ) : (
                  <>
                    <Avatar alt="User Photo" src={this.props.userPhoto} />
                  </>
                )}
              </IconButton>
              <Menu
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
                    <MenuItem onClick={this.onLogin}>Login</MenuItem>
                  </>
                ) : (
                  <>
                    <p className="textUsername">
                      Hello, <b>{this.props.userName}</b>
                    </p>
                    <MenuItem
                      onClick={() => {
                        const modal = document.getElementById("add-facebook");
                        modal.style.display = "block";
                        this.handleClose();
                      }}
                    >
                      Profile
                    </MenuItem>
                    {/* <MenuItem onClick={this.handleClose}>My account</MenuItem> */}
                    <MenuItem onClick={this.onLogout}>Logout</MenuItem>
                  </>
                )}
              </Menu>
            </div>
          </Tabs>

          {/* My Profile */}
          <TabPanel value={this.state.value} index={1}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                <MyProfile />
              </>
            )}
          </TabPanel>

          {/* Ongoing Trips */}
          <TabPanel value={this.state.value} index={2}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                {this.props.ongoingTrips.length ? (
                  <Grid container>
                    <Grid item xs={5}>
                      <Container>
                        <Card className="tripInfo">
                          <OngoingTripInfo />
                        </Card>
                      </Container>
                    </Grid>
                    {/* {if statement and changing props value here} */}
                    <Grid item xs={7}>
                      {!this.props.showChat &&
                        !this.props.showEdit &&
                        this.props.ongoingTrips.length &&
                        this.props.mapTripMessage === 0 && (
                          <Map
                            trips={this.props.ongoingTrips}
                            currentTripIndex={
                              this.props.currentOngoingTripIndex
                            }
                          />
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

                      {this.props.mapTripMessage === 2 && <ChatBoard />}

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
          </TabPanel>

          {/* Search Trip */}
          <TabPanel value={this.state.value} index={3}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                {this.props.searchTrips.length ? (
                  <Grid container>
                    <Grid item xs={5}>
                      <Container>
                        <Card className="tripInfo">
                          <SearchTripInfo />
                        </Card>
                      </Container>
                    </Grid>
                    <Grid item xs={7}>
                      <Map
                        trips={this.props.searchTrips}
                        currentTripIndex={this.props.currentSearchTripIndex}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <div>There are no new trips available.</div>
                )}
              </>
            )}
          </TabPanel>

          {/* Build Trip */}
          <TabPanel value={this.state.value} index={4}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                <BuildTrip />
              </>
            )}
          </TabPanel>

          {/* Social */}
          {/* <TabPanel value={this.state.value} index={4}>
            <p>Social</p>
            <ChatBoard />
          </TabPanel> */}
          {/* About */}
          {this.state.value === 0 && (
            <div>
              <img className="bgImg" src={backgroundImg} alt="backImg" />
              <About />
            </div>
          )}
        </AppBar>

        {/* Click Login */}
        {this.state.value === -1 && (
          <div style={{ marginTop: "35px" }}>
            <Login />
          </div>
        )}
        <div className="modal" id="add-facebook">
          <div className="modal-content">
            <p>Add a link to your Facebook:</p>
            <input id="fb-url" placeholder="Paste URL here" />
            <button
              onClick={() => {
                const url = (document.getElementById(
                  "fb-url"
                ) as HTMLInputElement).value;
                myFirestore
                  .collection("users")
                  .doc(this.props.userId)
                  .update({ facebook: url });
                const modal = document.getElementById("add-facebook");
                modal.style.display = "none";
              }}
            >
              Submit
            </button>
            <br></br>
            <br></br>
            <button
              className="close"
              onClick={() => {
                const modal = document.getElementById("add-facebook");
                modal.style.display = "none";
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
