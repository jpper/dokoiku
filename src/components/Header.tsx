import React from "react";
import { connect } from "react-redux";
import "../styles/Header.css";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';


type myProps = {
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




type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

 

class Header extends React.Component<myProps> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  render() {
  return (
    <div className="root">
      <AppBar position="static">
        <Toolbar variant="dense">
          {/* <IconButton edge="start" className="menuButton" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          {/* <Button className="menuButton" color="inherit" aria-label="menu">
            Button
          </Button> */}
          <Button className="menuButton">
            About
          </Button>
          <Button className="menuButton">
            Ongoing trips
          </Button>
          <Button className="menuButton">
            Search trip
          </Button>
          <Button className="menuButton">
            Build trip
          </Button>
          <Button className="menuButton">
            Social
          </Button>


          
        </Toolbar>
      </AppBar>
    </div>
  );

}

}


export default connect(mapStateToProps, mapDispatchToProps)(Header);



//TODO Q: how do we set up general (app wide) colors
//TODO Q: mapDispatchToProps doesnt work if not commented out. How to connect it and make everything work together