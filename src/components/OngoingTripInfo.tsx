import React from "react";
import { connect } from "react-redux";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog
} from "@material-ui/core";
import moment from "moment";
import { myFirestore } from "../config/firebase";

// Material UI
import "../styles/Modal.css";
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UpdateIcon from "@material-ui/icons/Update";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ChatIcon from "@material-ui/icons/Chat";
import DescriptionIcon from "@material-ui/icons/Description";
import "../styles/TripInfo.css";

type myProps = {
  ongoingTrips: any;
  currentOngoingTripIndex: number;
  onShowChat: any;
  onPreviousTrip: any;
  onShowEdit: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
  users: any;
  toggleNotes: any;
  toggleMessages: any;
  mapTripMessage: any;
  onChangeDisplayProfile: any;
  displayProfile: string;
};

type myState = {
  toggleDialog: boolean;
};

class OngoingTripInfo extends React.Component<myProps, myState> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      toggleDialog: false
    };
  }
  async deleteTrip(
    tripId: string,
    userId: string,
    memberIds: string[],
    ownerId: string
  ) {
    if (userId === ownerId) {
      await myFirestore
        .collection("trips")
        .doc(tripId)
        .delete();
    } else {
      const newMemberIds = memberIds.filter(
        (memberId: string) => memberId !== userId
      );
      await myFirestore
        .collection("trips")
        .doc(tripId)
        .update({ memberIds: newMemberIds });
    }
    window.location.reload();
  }
  handleToggle = () => {
    this.setState({
      toggleDialog: !this.state.toggleDialog
    });
  };
  render() {
    if (this.props.users.length) {
      return (
        <div className="TripInfo">
          {/* Title */}
          <Typography variant="h3" className="typoH3">
            <b>
              {this.props.ongoingTrips[this.props.currentOngoingTripIndex].name}
            </b>
          </Typography>
          {/* Start Date */}
          <Typography className="iconWrapper">
            <DateRangeIcon />
            Start Date:{" "}
            {moment(
              this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].startDate.toDate()
            ).format("MMMM Do YYYY")}
          </Typography>

          {/* End Date */}
          <Typography className="iconWrapper">
            <DateRangeIcon />
            End Date:{" "}
            {moment(
              this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].endDate.toDate()
            ).format("MMMM Do YYYY")}
          </Typography>

          {/* Starting Location */}
          <Typography className="iconWrapper">
            <DoubleArrowIcon />
            Starting Location:
            {` ${
              this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                .startLocation
            }`}
          </Typography>

          {/* WayPoints */}
          <div>
            <List>
              <Typography variant="h5">Waypoints:</Typography>
              {this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].waypoints.map((l: any, i: number) => {
                return (
                  <ListItem key={i} className="tripLocation">
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary={l.location} />
                  </ListItem>
                );
              })}
            </List>
          </div>

          {/* Budget */}
          <Typography className="iconWrapper">
            <MonetizationOnIcon />
            Budget:{" "}
            {this.props.ongoingTrips[this.props.currentOngoingTripIndex].budget}
          </Typography>

          <div className="spacer10"></div>

          {/* Notes & Messages */}
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            fullWidth
            onClick={() => this.props.toggleNotes()}
          >
            <DescriptionIcon className="iconSpacer" />
            Notes
          </Button>
          <br></br>
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            fullWidth
            onClick={() => this.props.toggleMessages()}
          >
            <ChatIcon className="iconSpacer" />
            Messages
          </Button>

          <div className="spacer10"></div>

          <div>
            <Typography variant="h5">Owned by:</Typography>
            <div>
              {
                this.props.users.find(
                  (user: any) =>
                    user.id ===
                    this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .ownerId
                ).nickname
              }
            </div>
          </div>

          {/* Members */}
          <div>
            <Typography variant="h5">Members:</Typography>

            <div className="memberContainer">
              {this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].memberIds.map((m: any, i: number) => {
                const nickname = this.props.users.find(
                  (u: { id: any }) => u.id === m
                ).nickname;
                return (
                  <div>
                    <p
                      key={i}
                      onClick={() => {
                        this.props.onChangeDisplayProfile(m);
                        console.log(this.props.displayProfile);
                      }}
                    >
                      <PersonIcon className="iconSpacer" />
                      {nickname}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Update & Delete button */}
          <Grid container>
            <Grid item xs={6}>
              <Button
                fullWidth
                onClick={this.props.onShowEdit}
                variant="contained"
                color="primary"
                size="large"
              >
                <UpdateIcon />
                UPDATE
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                fullWidth
                onClick={this.handleToggle}
                variant="contained"
                color="secondary"
                size="large"
              >
                <DeleteForeverIcon />
                {this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .ownerId === this.props.userId
                  ? "DELETE"
                  : "LEAVE"}
              </Button>
              <Dialog
                open={this.state.toggleDialog}
                onClose={this.handleToggle}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Confirm</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to{" "}
                    {this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .ownerId === this.props.userId
                      ? "delete"
                      : "leave"}{" "}
                    this trip?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleToggle} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      this.deleteTrip(
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex
                        ].tripId,
                        this.props.userId,
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex
                        ].memberIds,
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex
                        ].ownerId
                      )
                    }
                    color="primary"
                    autoFocus
                  >
                    {this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .ownerId === this.props.userId
                      ? "Delete"
                      : "Leave"}
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid>

            {/* Previous & Next Button */}
            <Grid container>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="default"
                  size="small"
                  fullWidth
                  onClick={this.props.onPreviousTrip}
                >
                  <ArrowBackIosIcon />
                  Previous
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="default"
                  size="small"
                  fullWidth
                  onClick={this.props.onNextTrip}
                >
                  Next
                  <ArrowForwardIosIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return "Loading...";
    }
  }
}
const mapStateToProps = (state: any) => {
  return {
    ongoingTrips: state.ongoingTrips,
    currentOngoingTripIndex: state.currentOngoingTripIndex,
    userId: state.userId,
    users: state.users,
    mapTripMessage: state.mapTripMessage,
    displayProfile: state.displayProfile
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    onShowChat: () =>
      dispatch({
        type: "SHOW_CHAT"
      }),
    onPreviousTrip: () => {
      dispatch({
        type: "RESET_TOGGLE_MESSAGES"
      });
      dispatch({
        type: "PREVIOUS_ONGOING_TRIP"
      });
    },
    onNextTrip: () => {
      dispatch({
        type: "RESET_TOGGLE_MESSAGES"
      });
      dispatch({
        type: "NEXT_ONGOING_TRIP"
      });
    },
    toggleNotes: () =>
      dispatch({
        type: "TOGGLE_NOTES"
      }),
    toggleMessages: () =>
      dispatch({
        type: "TOGGLE_MESSAGES"
      }),
    onShowEdit: () => dispatch({ type: "SHOW_EDIT" }),
    onChangeDisplayProfile: (profile: string) =>
      dispatch({
        type: "CHANGE_DISPLAY_PROFILE",
        displayProfile: profile
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OngoingTripInfo);
