import React from "react";
import { connect } from "react-redux";
import TripInfo from "./TripInfo";
import Map from "./Map";
import ChatBoard from "./ChatBoard";
import About from "./About";
import BuildTrip from "./BuildTrip";
import Login from "./Login";
import firebase from "firebase";
import { myFirebase, myFirestore } from "../config/firebase";
import { setUserInfo } from "../redux/action";

// Material UI & Styles
import "../styles/Contents.css";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Tab,
  Tabs,
  Box,
  Grid,
  Avatar,
  Menu,
  MenuItem
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CardTravelIcon from "@material-ui/icons/CardTravel";
import SearchIcon from "@material-ui/icons/Search";
import BuildIcon from "@material-ui/icons/Build";
import ChatIcon from "@material-ui/icons/Chat";
import InfoIcon from "@material-ui/icons/Info";
import PersonIcon from "@material-ui/icons/Person";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

type myProps = {
  userId: string;
  userName: string;
  userPhoto: string;
  trips: any;
  currentTrip: number;
  showChat: boolean;
  showProfile: boolean;
  showBuild: boolean;
  onShowChat?: any;
  onShowProfile?: any;
  onShowBuild?: any;
  currentProfile: number;
  setUserInfo: any;
  login: any;
};

// class Header extends React.Component<myProps, {}> {
//   render() {
//     return (
//       <div className="Header">
//         Baru header
//       </div>
//     );
//   }
// }

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    userName: state.userName,
    userPhoto: state.userPhoto,
    trips: state.trips,
    currentTrip: state.currentTrip,
    showChat: state.showChat,
    showProfile: state.showProfile,
    showBuild: state.showBuild,
    currentProfile: state.currentProfile
  };
};

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Contents extends React.Component<myProps, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        this.props.setUserInfo(user.displayName, user.uid, user.photoURL);
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

  onLogout = () => {
    this.handleClose();
    this.props.setUserInfo("", "", "");
    firebase.auth().signOut();
    console.log("LOGOUT!!!");
  };

  onLogin = () => {
    this.handleClose();
    this.props.login();
  };

  render() {
    return (
      <div className="contents">
        <AppBar position="static">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            centered
            // variant="scrollable"
            // scrollButtons="on"
            // indicatorColor="primary"
            // textColor="primary"
            aria-label="scrollable force tabs example"
          >
            <Tab label="About" icon={<InfoIcon />} />
            <Tab label="Ongoing Trips" icon={<CardTravelIcon />} />
            <Tab label="Search Trip" icon={<SearchIcon />} />
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
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                    <MenuItem onClick={this.onLogout}>Logout</MenuItem>
                  </>
                )}
              </Menu>
            </div>
          </Tabs>

          {/* About */}
          <TabPanel value={this.state.value} index={0}>
            <About />
          </TabPanel>

          {/* Ongoing Trips */}
          <TabPanel value={this.state.value} index={1}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                <p>Ongoing Trips</p>
                <Grid container>
                  <Grid item xs={5}>
                    <TripInfo />
                  </Grid>
                  <Grid item xs={7}>
                    <Map
                      trips={this.props.trips}
                      currentTripIndex={this.props.currentTrip}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </TabPanel>

          {/* Search Trip */}
          <TabPanel value={this.state.value} index={2}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                <p>Search Trip</p>
                <Grid container>
                  <Grid item xs={5}>
                    <TripInfo />
                  </Grid>
                  <Grid item xs={7}>
                    <Map
                      trips={this.props.trips}
                      currentTripIndex={this.props.currentTrip}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </TabPanel>

          {/* Build Trip */}
          <TabPanel value={this.state.value} index={3}>
            {this.props.userId === "" ? (
              <Login />
            ) : (
              <>
                <p>Build Trip</p>
                <BuildTrip />
              </>
            )}
          </TabPanel>

          {/* Social */}
          {/* <TabPanel value={this.state.value} index={4}>
            <p>Social</p>
            <ChatBoard />
          </TabPanel> */}
        </AppBar>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contents);

//TODO Q: how do we set up general (app wide) colors
//TODO Q: mapDispatchToProps doesnt work if not commented out. How to connect it and make everything work together
