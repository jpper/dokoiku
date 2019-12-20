import React from "react";
import { connect } from "react-redux";
import { Button, Tooltip } from "@material-ui/core";
import moment from "moment";
// import firebase from "firebase";
import { myFirestore } from "../config/firebase";
import InfoIcon from "@material-ui/icons/Info";

// Material UI and styling
import "../styles/Modal.css";
import { Grid, Typography } from "@material-ui/core";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import "../styles/TripInfo.css";
import countriesToCurrencies from "../data/countries_to_currencies.json";
import axios from "axios";

type myProps = {
  searchTrips: any;
  users: any;
  currentSearchTripIndex: number;
  onShowChat: any;
  onPreviousTrip: any;
  onNextTrip: any;
  onJoinTrip?: any;
  userId: string;
  onChangeDisplayProfile: any;
  displayProfile: string;
  userCurrencyCode: string;
};

type myState = {
  togglePending: boolean;
  userCurrencyBudget: number;
};

class SearchTripInfo extends React.Component<myProps, myState> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      togglePending: false,
      userCurrencyBudget: 0
    };
  }

  handleToggle = () => {
    this.setState({
      togglePending: true
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
      this.props.searchTrips[this.props.currentSearchTripIndex].currencyCode,
      this.props.userCurrencyCode,
      this.props.searchTrips[this.props.currentSearchTripIndex].budget
    );
  }
  render() {
    if (this.props.users.length && this.props.userCurrencyCode) {
      return (
        <div className="TripInfo">
          {/* Title */}
          <div style={{ maxHeight: 480, overflow: "scroll" }}>
            <Typography variant="h4" className="noWrapper">
              <b>
                {this.props.searchTrips[this.props.currentSearchTripIndex].name}
              </b>
            </Typography>

            {/* Country */}
            <Typography className="iconWrapper">
              <strong>Country: </strong>
              <img
                src={`https://www.countryflags.io/${this.props.searchTrips[
                  this.props.currentSearchTripIndex
                ].countryCode.toLowerCase()}/shiny/24.png`}
                alt="flag"
              ></img>
              {
                countriesToCurrencies.find(
                  (item: any) =>
                    this.props.searchTrips[this.props.currentSearchTripIndex]
                      .countryCode === item.countryCode
                ).country
              }
            </Typography>

            {/* Starting Location */}
            <Typography className="noWrapper">
              <DoubleArrowIcon />
              <strong>Starting Location: </strong>
              {` ${
                this.props.searchTrips[this.props.currentSearchTripIndex]
                  .startLocation
              }`}
            </Typography>

            {/* Start Date */}
            <Typography className="noWrapper">
              <DateRangeIcon />
              <strong>Start Date: </strong>
              {moment(
                this.props.searchTrips[
                  this.props.currentSearchTripIndex
                ].startDate.toDate()
              ).format("MMMM Do YYYY")}
            </Typography>

            {/* End Date */}
            <Typography className="noWrapper">
              <DateRangeIcon />
              <strong>End Date: </strong>
              {moment(
                this.props.searchTrips[
                  this.props.currentSearchTripIndex
                ].endDate.toDate()
              ).format("MMMM Do YYYY")}
            </Typography>

            {/* WayPoints */}
            <div>
              <Typography className="noWrapper">
                <LocationOnIcon />
                <strong className="boldText topPadding">Destinations:</strong>
              </Typography>
              <ul className="ul-test">
                {this.props.searchTrips[
                  this.props.currentSearchTripIndex
                ].waypoints.map((l: any, i: number) => {
                  return (
                    <>
                      <Typography className="noWrapper">
                        <li>{l.location}</li>
                      </Typography>
                    </>
                  );
                })}
              </ul>
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
              <Typography className="noWrapper topPadding">
                <InfoIcon />
                <strong>Budget: </strong>
                {
                  this.props.searchTrips[this.props.currentSearchTripIndex]
                    .budget
                }{" "}
                {
                  countriesToCurrencies.find(
                    (item: any) =>
                      this.props.searchTrips[this.props.currentSearchTripIndex]
                        .currencyCode === item.currencyCode
                  ).currency
                }
              </Typography>
            </Tooltip>
            <div className="spacer10"></div>

            <div>
              <Typography className="noWrapper topPadding">
                <strong>Owned by:</strong>
              </Typography>
              <div>
                {[
                  this.props.searchTrips[this.props.currentSearchTripIndex]
                    .memberIds[0]
                ].map((m: any, i: number) => {
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
                        onClick={() => {
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
            <div>
              <Typography className="noWrapper topPadding">
                <strong>Members:</strong>
              </Typography>
              <Typography className="noWrapper">
                {this.props.searchTrips[this.props.currentSearchTripIndex]
                  .memberIds.length === 1
                  ? "1 member"
                  : "" +
                    this.props.searchTrips[this.props.currentSearchTripIndex]
                      .memberIds.length +
                    " members"}
              </Typography>
              <br />
            </div>
          </div>
          <Button
            onClick={() => {
              this.props.onJoinTrip(
                this.props.searchTrips[this.props.currentSearchTripIndex]
                  .ownerId,
                this.props.userId,
                this.props.searchTrips[this.props.currentSearchTripIndex].tripId
              );
              this.handleToggle();
            }}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            <GroupAddIcon />
            {this.state.togglePending ? "PENDING..." : "JOIN!"}
          </Button>

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
                  if (this.props.currentSearchTripIndex - 1 >= 0) {
                    this.exchangeCurrency(
                      this.props.searchTrips[
                        this.props.currentSearchTripIndex - 1
                      ].currencyCode,
                      this.props.userCurrencyCode,
                      this.props.searchTrips[
                        this.props.currentSearchTripIndex - 1
                      ].budget
                    );
                  } else {
                    this.exchangeCurrency(
                      this.props.searchTrips[this.props.searchTrips.length - 1]
                        .currencyCode,
                      this.props.userCurrencyCode,
                      this.props.searchTrips[this.props.searchTrips.length - 1]
                        .budget
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
                    this.props.currentSearchTripIndex + 1 <
                    this.props.searchTrips.length
                  ) {
                    this.exchangeCurrency(
                      this.props.searchTrips[
                        this.props.currentSearchTripIndex + 1
                      ].currencyCode,
                      this.props.userCurrencyCode,
                      this.props.searchTrips[
                        this.props.currentSearchTripIndex + 1
                      ].budget
                    );
                  } else {
                    this.exchangeCurrency(
                      this.props.searchTrips[0].currencyCode,
                      this.props.userCurrencyCode,
                      this.props.searchTrips[0].budget
                    );
                  }
                }}
              >
                Next
                <ArrowForwardIosIcon />
              </Button>
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
    userId: state.userId,
    searchTrips: state.searchTrips,
    users: state.users,
    currentSearchTripIndex: state.currentSearchTripIndex,
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
    onPreviousTrip: () =>
      dispatch({
        type: "PREVIOUS_SEARCH_TRIP"
      }),
    onNextTrip: () =>
      dispatch({
        type: "NEXT_SEARCH_TRIP"
      }),
    onJoinTrip: (ownerId: string, userId: string, tripId: string) => {
      myFirestore
        .collection("users")
        .doc(ownerId)
        .collection("requests")
        .doc(userId + tripId)
        .set({
          fromId: userId,
          tripId: tripId
        });
      myFirestore
        .collection("users")
        .doc(userId)
        .collection("pendingTrips")
        .doc(tripId)
        .set({ tripId });
    },
    onChangeDisplayProfile: (profile: string) =>
      dispatch({
        type: "CHANGE_DISPLAY_PROFILE",
        displayProfile: profile
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchTripInfo);
