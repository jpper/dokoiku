import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { firestore } from "firebase";
import { myFirestore } from "../config/firebase";
import BasicTripInfo from "./BasicTripInfo";
import Map from "./Map";
import Notes from "./Notes";
import ChatBoard from "./ChatBoard";
import axios from "axios";

// Material UI
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Fade,
  Backdrop,
  Button,
  TextareaAutosize,
  Box,
  Container,
  Card,
  Tooltip
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DescriptionIcon from "@material-ui/icons/Description";
import "../styles/TripInfo.css";
import "../styles/PastTripInfo.css";
import Reviews from "./Reviews";
import countriesToCurrencies from "../data/countries_to_currencies.json";

enum PageStatus {
  Map,
  Reviews,
  Notes,
  Messages
}

interface myStates {
  modalStatus: any;
  targetUser: number;
  rating: number;
  message: string;
  isError: boolean;
  pageStatus: PageStatus;
  pastTrips: any[];
  currentPastTripIndex: number;
  userCurrencyBudget: any;
}

class PastTripInfo extends React.Component<any, myStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalStatus: [],
      targetUser: -1,
      rating: 0,
      message: "",
      isError: false,
      pageStatus: PageStatus.Map,
      pastTrips: [],
      currentPastTripIndex: 0,
      userCurrencyBudget: 0
    };
  }

  componentDidMount() {
    console.log("PAST_TRIP_INFO");

    // get PastTrips
    const tmpPastTrips = this.props.ongoingTrips.filter((data: any) => {
      const today = new Date();
      return today.getTime() > data.endDate.toDate().getTime();
    });
    this.setState({
      pastTrips: tmpPastTrips
    });
    console.log(tmpPastTrips);

    // Setup modal window status (Open/ Close)
    let initialStatus = Array(this.state.pastTrips.length);
    initialStatus.fill(false);
    this.setState({
      modalStatus: initialStatus
    });
  }

  prevPastTrip = () => {
    let prevIndex: number;
    console.log(this.state.pastTrips);
    if (this.state.currentPastTripIndex === 0) {
      prevIndex = this.state.pastTrips.length - 1;
    } else {
      prevIndex = this.state.currentPastTripIndex - 1;
    }
    this.setState({
      currentPastTripIndex: prevIndex
    });
  };

  nextPastTrip = () => {
    let nextIndex: number;
    if (this.state.currentPastTripIndex + 1 >= this.state.pastTrips.length) {
      nextIndex = 0;
    } else {
      nextIndex = this.state.currentPastTripIndex + 1;
    }
    this.setState({
      currentPastTripIndex: nextIndex
    });
  };

  onClickUser = (index: number, member: any) => {
    this.setState({
      targetUser: index
    });

    // get a previous review if possible
    this.checkPrevReview(member);
  };

  checkPrevReview = async (reviewee: any) => {
    const tripId = this.state.pastTrips[
      this.state.currentPastTripIndex
    ].tripId.trim();
    const reviewer = this.props.userId;
    const reviewId = tripId + "_" + reviewer + "_" + reviewee;

    const result = await myFirestore
      .collection("users")
      .doc(reviewee)
      .collection("reviews")
      .doc(reviewId)
      .get();

    if (result.exists) {
      this.setState({
        rating: result.data().rating,
        message: result.data().message
      });
    }
  };

  handleOpen = (index: number) => {
    if (this.state.targetUser === index) return true;
    return false;
  };

  SetMessage = (e: any) => {
    this.setState({
      message: e.target.value
    });
  };

  handleClose = () => {
    // Reset rating & message
    this.setState({
      targetUser: -1,
      rating: 0,
      message: "",
      isError: false
    });
  };

  saveReviews = (event: any, reviewee: any) => {
    const tripId = this.state.pastTrips[
      this.state.currentPastTripIndex
    ].tripId.trim();
    const reviewer = this.props.userId;
    const reviewId = tripId + "_" + reviewer + "_" + reviewee;
    const postDate = firestore.Timestamp.fromDate(new Date());
    console.log(reviewee);

    myFirestore
      .collection("users")
      .doc(reviewee)
      .collection("reviews")
      .doc(reviewId)
      .set({
        tripId: myFirestore.doc("trips/" + tripId),
        reviewer: myFirestore.doc("users/" + reviewer),
        rating: this.state.rating,
        message: this.state.message,
        date: postDate
      });
  };

  checkInput = () => {
    if (this.state.rating === 0 || this.state.message === "") return false;
    return true;
  };

  onSubmit = (event: any, reviewee: any) => {
    // If textarea or rating is empty, error
    if (!this.checkInput()) {
      this.setState({
        isError: true
      });
      return;
    }

    this.saveReviews(event, reviewee);
    this.handleClose();
  };

  onMapButton = () => {
    this.setState({
      pageStatus: PageStatus.Map
    });
  };

  onReviewButton = () => {
    this.setState({
      pageStatus: PageStatus.Reviews
    });
  };

  onNotesButton = () => {
    this.setState({
      pageStatus: PageStatus.Notes
    });
  };

  onMessagesButton = () => {
    this.setState({
      pageStatus: PageStatus.Messages
    });
  };

  clearButtonStatus = () => {
    this.setState({
      pageStatus: PageStatus.Map
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
    console.log(result.data);
    const userCurrencyBudget = result.data * budget;
    this.setState({ userCurrencyBudget });
  };

  componentWillMount() {
    if (this.props.ongoingTrips > 0) {
      this.exchangeCurrency(
        this.props.ongoingTrips[this.props.currentOngoingTripIndex]
          .currencyCode,
        this.props.userCurrencyCode,
        this.props.ongoingTrips[this.props.currentOngoingTripIndex].budget
      );
    }
  }

  render() {
    return (
      <div className="pastTripInfo">
        {this.state.pastTrips.length === 0 ||
        this.props.userCurrencyCode === "" ? (
          <p>Nothing past trips</p>
        ) : (
          <Grid container>
            {/* Trip details */}
            <Grid item xs={5}>
              <Container>
                <Card>
                  <BasicTripInfo
                    country={
                      this.state.pastTrips[this.state.currentPastTripIndex]
                        .countryCode
                    }
                    tripTitle={
                      this.state.pastTrips[this.state.currentPastTripIndex].name
                    }
                    startDate={moment(
                      this.state.pastTrips[
                        this.state.currentPastTripIndex
                      ].startDate.toDate()
                    ).format("MMMM Do YYYY")}
                    endDate={moment(
                      this.state.pastTrips[
                        this.state.currentPastTripIndex
                      ].endDate.toDate()
                    ).format("MMMM Do YYYY")}
                    location={
                      this.state.pastTrips[this.state.currentPastTripIndex]
                        .startLocation
                    }
                    wayPoints={
                      this.state.pastTrips[this.state.currentPastTripIndex]
                    }
                  />

                  {/* Budget */}
                  <Tooltip
                    title={
                      this.props.userCurrencyCode !== "None"
                        ? Math.round(this.state.userCurrencyBudget * 100) /
                            100 +
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
                                this.props.userCurrencyCode ===
                                item.currencyCode
                            ).currency
                        : ""
                    }
                    placement="top-end"
                  >
                    <Typography className="iconWrapper">
                      Budget:{" "}
                      {
                        this.state.pastTrips[this.state.currentPastTripIndex]
                          .budget
                      }{" "}
                      {
                        countriesToCurrencies.find(
                          (item: any) =>
                            this.state.pastTrips[
                              this.state.currentPastTripIndex
                            ].currencyCode === item.currencyCode
                        ).currency
                      }
                    </Typography>
                  </Tooltip>

                  <div className="spacer10"></div>

                  {/* Notes & Messages */}
                  <Grid item>
                    {this.state.pageStatus !== PageStatus.Map ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        fullWidth
                        onClick={this.onMapButton}
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Map
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        fullWidth
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Map
                      </Button>
                    )}
                  </Grid>

                  <Grid item>
                    {this.state.pageStatus !== PageStatus.Reviews ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        fullWidth
                        onClick={this.onReviewButton}
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Reviews for me
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        fullWidth
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Reviews for me
                      </Button>
                    )}
                  </Grid>

                  <Grid item>
                    {this.state.pageStatus !== PageStatus.Notes ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        fullWidth
                        onClick={this.onNotesButton}
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Notes
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        fullWidth
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Notes
                      </Button>
                    )}
                  </Grid>

                  <Grid item>
                    {this.state.pageStatus !== PageStatus.Messages ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        fullWidth
                        onClick={this.onMessagesButton}
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Messages
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        fullWidth
                      >
                        <DescriptionIcon className="iconSpacer" />
                        Messages
                      </Button>
                    )}
                  </Grid>

                  <div className="spacer10"></div>

                  {/* Members */}
                  <div>
                    <Typography variant="h4">Review for Members:</Typography>
                    <List component="nav">
                      {this.state.pastTrips[
                        this.state.currentPastTripIndex
                      ].memberIds.map((member: any, i: number) => {
                        const nickname = this.props.users.find(
                          (u: { id: any }) => u.id === member
                        ).nickname;
                        //   FIXME: skips own data here
                        //   if (member === this.props.userId) return;

                        return (
                          <div key={i}>
                            {/* <ListItem
                              button
                              onClick={() => this.onClickUser(i, member)}
                            >
                              <ListItemIcon>
                                <PersonIcon className="iconSpacer" />
                              </ListItemIcon>
                              <ListItemText>{nickname}</ListItemText>
                            </ListItem> */}
                            <Button
                              variant="outlined"
                              color="primary"
                              size="medium"
                              fullWidth
                              key={i}
                              onClick={() => this.onClickUser(i, member)}
                            >
                              <PersonIcon className="iconSpacer" />
                              {nickname}
                            </Button>
                            <Modal
                              className="modalWindow"
                              open={this.handleOpen(i)}
                              onClose={this.handleClose}
                              closeAfterTransition
                              BackdropComponent={Backdrop}
                              BackdropProps={{
                                timeout: 500
                              }}
                            >
                              <Fade in={this.handleOpen(i)}>
                                <div className="modalFade">
                                  <Box
                                    component="fieldset"
                                    mb={0}
                                    borderColor="transparent"
                                  >
                                    <h2 id="transition-modal-title">
                                      Review for {nickname}
                                    </h2>
                                  </Box>

                                  {/* Error */}
                                  {this.state.isError && (
                                    <Box
                                      component="fieldset"
                                      mb={0}
                                      borderColor="transparent"
                                    >
                                      <Typography className="error-text">
                                        Textarea or Rating is empty...
                                      </Typography>
                                    </Box>
                                  )}

                                  <Box
                                    component="fieldset"
                                    mb={1}
                                    borderColor="transparent"
                                  >
                                    <Typography component="legend">
                                      Rating
                                    </Typography>
                                    <Rating
                                      name="simple-controlled"
                                      value={this.state.rating}
                                      onChange={(event, newValue) => {
                                        this.setState({
                                          rating: newValue
                                        });
                                      }}
                                    />
                                  </Box>
                                  <Box
                                    component="fieldset"
                                    mb={0}
                                    borderColor="transparent"
                                  >
                                    <Typography component="legend">
                                      Review Message
                                    </Typography>

                                    <TextareaAutosize
                                      className="textarea"
                                      placeholder="Write your review"
                                      rows={10}
                                      onChange={e => this.SetMessage(e)}
                                      value={this.state.message}
                                    />
                                  </Box>
                                  <Box
                                    component="fieldset"
                                    mb={0}
                                    borderColor="transparent"
                                  >
                                    <Button
                                      variant="contained"
                                      color="default"
                                      onClick={this.handleClose}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={event => {
                                        this.onSubmit(event, member);
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                </div>
                              </Fade>
                            </Modal>
                          </div>
                        );
                      })}
                    </List>
                  </div>

                  {/* Previous & Next Button */}
                  <Grid container>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="default"
                        size="small"
                        fullWidth
                        onClick={() => {
                          this.clearButtonStatus();
                          this.prevPastTrip();
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
                          this.clearButtonStatus();
                          this.nextPastTrip();
                        }}
                      >
                        Next
                        <ArrowForwardIosIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Container>
            </Grid>

            {/* Map, Review Result */}
            <Grid item xs={7}>
              {this.state.pageStatus === PageStatus.Map && (
                <Map
                  trips={this.state.pastTrips}
                  currentTripIndex={this.state.currentPastTripIndex}
                />
              )}
              {this.state.pageStatus === PageStatus.Reviews && (
                <Reviews
                  tripId={
                    this.state.pastTrips[this.state.currentPastTripIndex].tripId
                  }
                  userId={this.props.userId}
                />
              )}
              {this.state.pageStatus === PageStatus.Notes && (
                <Notes
                  tripId={
                    this.state.pastTrips[this.state.currentPastTripIndex].tripId
                  }
                />
              )}

              {this.state.pageStatus === PageStatus.Messages && (
                <ChatBoard
                  tripId={
                    this.state.pastTrips[this.state.currentPastTripIndex].tripId
                  }
                />
              )}
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    ongoingTrips: state.ongoingTrips,
    currentOngoingTripIndex: state.currentOngoingTripIndex,
    userId: state.userId,
    users: state.users,
    mapTripMessage: state.mapTripMessage,
    userCurrencyCode: state.userCurrencyCode
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
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
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PastTripInfo);
