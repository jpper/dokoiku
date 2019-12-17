import React from "react";
import { connect } from "react-redux";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Tooltip
} from "@material-ui/core";
import moment from "moment";
import { myFirestore } from "../config/firebase";
import axios from "axios";
import countriesToCurrencies from "../data/countries_to_currencies.json";
// Material UI
import "../styles/Modal.css";
import {
  Grid,
  // List,
  // ListItem,
  // ListItemIcon,
  // ListItemText,
  Typography
} from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DateRangeIcon from "@material-ui/icons/DateRange";
//import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
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
  userCurrencyCode: string;
};

type myState = {
  toggleDialog: boolean;
  userCurrencyBudget: number;
};

class OngoingTripInfo extends React.Component<myProps, myState> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      toggleDialog: false,
      userCurrencyBudget: 0
    };
  }
  async deleteTrip(
    tripId: string,
    userId: string,
    memberIds: string[],
    ownerId: string
  ) {
    if (userId === ownerId) {
      const request_query = myFirestore
        .collection("users")
        .doc(ownerId)
        .collection("requests")
        .where("tripId", "==", tripId);
      request_query.get().then((data: any) => {
        data.forEach((doc: any) => {
          doc.ref.delete();
        });
      });
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
  exchangeCurrency = async (
    fromCurrency: string,
    toCurrency: string,
    budget: number
  ) => {
    const result = await axios.get(
      `https://currency-exchange.p.rapidapi.com/exchange?q=1&from=${fromCurrency}&to=${toCurrency}`,
      {
        headers: {
          "x-rapidapi-host": "currency-exchange.p.rapidapi.com",
          "x-rapidapi-key": "b6e4f9fc03msh80db2bc55980af4p181a67jsnb4b3c557714d"
        }
      }
    );
    //console.log(result.data);
    const userCurrencyBudget = result.data * budget;
    this.setState({ userCurrencyBudget });
  };
  componentWillMount() {
    this.exchangeCurrency(
      this.props.ongoingTrips[this.props.currentOngoingTripIndex].currencyCode,
      this.props.userCurrencyCode,
      this.props.ongoingTrips[this.props.currentOngoingTripIndex].budget
    );
  }
  render() {
    if (this.props.users.length && this.props.userCurrencyCode) {
      return (
        <div className="TripInfo">
          {/* Title */}
          <Typography variant="h3" className="typoH3">
            <b>
              {this.props.ongoingTrips[this.props.currentOngoingTripIndex].name}
            </b>
          </Typography>
          {/* Country */}
          <Typography className="iconWrapper">
            <strong>Country: </strong>
            <img
              src={`https://www.countryflags.io/${this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].countryCode.toLowerCase()}/shiny/24.png`}
              alt="flag"
            ></img>
            {
              countriesToCurrencies.find(
                (item: any) =>
                  this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                    .countryCode === item.countryCode
              ).country
            }
          </Typography>
          {/* Starting Location */}
          <Typography className="iconWrapper">
            <DoubleArrowIcon />
            <strong>Starting Location:</strong>

            {` ${
              this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                .startLocation
            }`}
          </Typography>
          {/* Start Date */}
          <Typography className="iconWrapper">
            <DateRangeIcon />
            <strong>Start Date: </strong>
            {moment(
              this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].startDate.toDate()
            ).format("MMMM Do YYYY")}
          </Typography>

          {/* End Date */}
          <Typography className="iconWrapper">
            <DateRangeIcon />
            <strong>End Date: </strong>
            {moment(
              this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].endDate.toDate()
            ).format("MMMM Do YYYY")}
          </Typography>

          {/* WayPoints */}
          <div>
            <Typography className="noWrapper">
              <strong className="boldText">Destinations:</strong>
            </Typography>
            {this.props.ongoingTrips[
              this.props.currentOngoingTripIndex
            ].waypoints.map((l: any, i: number) => {
              return (
                <div>
                  <Typography className="noWrapper">{l.location}</Typography>
                </div>
                // <ListItem key={i} className="tripLocation">
                //   <ListItemText primary={l.location} />
                // </ListItem>
              );
            })}
          </div>

          {/* Budget */}
          <Tooltip
            title={
              this.props.userCurrencyCode !== "None"
                ? Math.round(this.state.userCurrencyBudget * 100) / 100 +
                  " " +
                  countriesToCurrencies
                    .concat([
                      {
                        country: "None",
                        countryCode: "None",
                        currency: "None",
                        currencyCode: "None"
                      }
                    ])
                    .find(
                      (item: any) =>
                        this.props.userCurrencyCode === item.currencyCode
                    ).currency
                : ""
            }
            placement="top-end"
          >
            <Typography className="iconWrapper">
              <strong>Budget: </strong>
              {
                this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  .budget
              }{" "}
              {
                countriesToCurrencies.find(
                  (item: any) =>
                    this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .currencyCode === item.currencyCode
                ).currency
              }
            </Typography>
          </Tooltip>
          <div className="spacer10"></div>

          {/* Notes & Messages */}
          <Button
            variant="outlined"
            color="primary"
            size="medium"
            fullWidth
            onClick={async () => {
              await this.props.onChangeDisplayProfile(undefined);
              this.props.toggleNotes();
            }}
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
            onClick={async () => {
              await this.props.onChangeDisplayProfile(undefined);
              this.props.toggleMessages();
            }}
          >
            <ChatIcon className="iconSpacer" />
            Messages
          </Button>

          <div className="spacer10"></div>

          <div>
            <Typography variant="h5">Owned by:</Typography>
            <div className="owner">
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                fullWidth
              >
                <PersonIcon />
                {
                  this.props.users.find(
                    (user: any) =>
                      user.id ===
                      this.props.ongoingTrips[
                        this.props.currentOngoingTripIndex
                      ].ownerId
                  ).nickname
                }
              </Button>
            </div>
          </div>
          <br />

          {/* Members */}
          <div>
            <Typography variant="h5">
              <strong>Members:</strong>
            </Typography>

            <div className="memberContainer">
              {this.props.ongoingTrips[
                this.props.currentOngoingTripIndex
              ].memberIds.map((m: any, i: number) => {
                const nickname = this.props.users.find(
                  (u: { id: any }) => u.id === m
                ).nickname;
                return (
                  <div>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      fullWidth
                      key={i}
                      onClick={async () => {
                        await this.props.onChangeDisplayProfile(undefined);
                        this.props.onChangeDisplayProfile(m);
                      }}
                    >
                      <PersonIcon className="iconSpacer" />
                      {nickname}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
          <br />
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
                  onClick={() => {
                    this.props.onPreviousTrip();
                    if (this.props.currentOngoingTripIndex - 1 >= 0) {
                      this.exchangeCurrency(
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex - 1
                        ].currencyCode,
                        this.props.userCurrencyCode,
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex - 1
                        ].budget
                      );
                    } else {
                      this.exchangeCurrency(
                        this.props.ongoingTrips[
                          this.props.ongoingTrips.length - 1
                        ].currencyCode,
                        this.props.userCurrencyCode,
                        this.props.ongoingTrips[
                          this.props.ongoingTrips.length - 1
                        ].budget
                      );
                    }
                  }}
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
                  onClick={() => {
                    this.props.onNextTrip();
                    if (
                      this.props.currentOngoingTripIndex + 1 <
                      this.props.ongoingTrips.length
                    ) {
                      this.exchangeCurrency(
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex + 1
                        ].currencyCode,
                        this.props.userCurrencyCode,
                        this.props.ongoingTrips[
                          this.props.currentOngoingTripIndex + 1
                        ].budget
                      );
                    } else {
                      this.exchangeCurrency(
                        this.props.ongoingTrips[0].currencyCode,
                        this.props.userCurrencyCode,
                        this.props.ongoingTrips[0].budget
                      );
                    }
                  }}
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
    displayProfile: state.displayProfile,
    userCurrencyCode: state.userCurrencyCode
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
