import React from "react";
import { connect } from "react-redux";
import TripInfo from "./TripInfo";
import Map from "./Map";
import ChatBoard from "./ChatBoard";
import About from "./About";
import BuildTrip from "./BuildTrip";
import Login from "./Login";
import firebase from "firebase";

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

type myProps = {
  userId: string;
  trips: any;
  currentTrip: number;
  showChat: boolean;
  showProfile: boolean;
  showBuild: boolean;
  onShowChat?: any;
  onShowProfile?: any;
  onShowBuild?: any;
  currentProfile: number;
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
    trips: state.trips,
    currentTrip: state.currentTrip,
    showChat: state.showChat,
    showProfile: state.showProfile,
    showBuild: state.showBuild,
    currentProfile: state.currentProfile
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  // onShowChat: () =>
  //   dispatch({
  //     type: "SHOW_CHAT"
  //   }),
  // onShowProfile: (index: number) =>
  //   dispatch({
  //     type: "SHOW_PROFILE",
  //     index
  //   }),
  // onShowBuild: (index: number) =>
  //   dispatch({
  //     type: "SHOW_BUILD",
  //     index
  //   })
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
            <div className="iconWrapper">
              <IconButton
                color="inherit"
                aria-controls="personalMenu"
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <PersonIcon />
              </IconButton>
              <Menu
                id="personalMenu"
                anchorEl={this.state.anchorEl}
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
                <MenuItem onClick={this.onLogout}>Logout</MenuItem>
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
                    <Map />
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
                    <Map />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contents);

//TODO Q: how do we set up general (app wide) colors
//TODO Q: mapDispatchToProps doesnt work if not commented out. How to connect it and make everything work together
