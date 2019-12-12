import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { firestore } from "firebase";
import { myFirestore } from "../config/firebase";
import BasicTripInfo from "./BasicTripInfo";
import Map from "./Map";

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
  Card
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DescriptionIcon from "@material-ui/icons/Description";
import "../styles/TripInfo.css";
import "../styles/PastTripInfo.css";
import Reviews from "./Reviews";

enum PageStatus {
  Map,
  Reviews
}

interface myStates {
  modalStatus: any;
  targetUser: number;
  rating: number;
  message: string;
  isError: boolean;
  pageStatus: PageStatus;
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
      pageStatus: PageStatus.Map
    };
  }

  componentDidMount() {
    let initialStatus = Array(this.props.ongoingTrips.length);
    initialStatus.fill(false);
    this.setState({
      modalStatus: initialStatus
    });
  }

  onClickUser = (index: number, member: any) => {
    this.setState({
      targetUser: index
    });

    // get a previous review if possible
    this.checkPrevReview(member);
  };

  checkPrevReview = async (reviewee: any) => {
    const tripId = this.props.ongoingTrips[
      this.props.currentOngoingTripIndex
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
    const tripId = this.props.ongoingTrips[
      this.props.currentOngoingTripIndex
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

  onReviewButton = () => {
    if (this.state.pageStatus === PageStatus.Map) {
      this.setState({
        pageStatus: PageStatus.Reviews
      });
    } else if (this.state.pageStatus === PageStatus.Reviews) {
      this.setState({
        pageStatus: PageStatus.Map
      });
    }
  };

  clearButtonStatus = () => {
    this.setState({
      pageStatus: PageStatus.Map
    });
  };

  render() {
    return (
      <div className="pastTripInfo">
        <Grid container>
          {/* Trip details */}
          <Grid item xs={5}>
            <Container>
              <Card>
                <BasicTripInfo
                  tripTitle={
                    this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .name
                  }
                  startDate={moment(
                    this.props.ongoingTrips[
                      this.props.currentOngoingTripIndex
                    ].startDate.toDate()
                  ).format("MMMM Do YYYY")}
                  endDate={moment(
                    this.props.ongoingTrips[
                      this.props.currentOngoingTripIndex
                    ].endDate.toDate()
                  ).format("MMMM Do YYYY")}
                  location={
                    this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .startLocation
                  }
                  wayPoints={
                    this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                  }
                  budget={
                    this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                      .budget
                  }
                />

                <div className="spacer10"></div>

                {/* Notes & Messages */}
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  fullWidth
                  onClick={this.onReviewButton}
                >
                  <DescriptionIcon className="iconSpacer" />
                  {this.state.pageStatus === PageStatus.Map && `Reviews for me`}
                  {this.state.pageStatus === PageStatus.Reviews && `Map`}
                </Button>
                {/* <Button
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
        </Button> */}

                <div className="spacer10"></div>

                {/* Members */}
                <div>
                  <Typography variant="h5">Members:</Typography>
                  <List component="nav">
                    {this.props.ongoingTrips[
                      this.props.currentOngoingTripIndex
                    ].memberIds.map((member: any, i: number) => {
                      const nickname = this.props.users.find(
                        (u: { id: any }) => u.id === member
                      ).nickname;
                      //   FIXME: skips own data here
                      //   if (member === this.props.userId) return;

                      return (
                        <div key={i}>
                          <ListItem
                            button
                            onClick={() => this.onClickUser(i, member)}
                          >
                            <ListItemIcon>
                              <PersonIcon className="iconSpacer" />
                            </ListItemIcon>
                            <ListItemText>{nickname}</ListItemText>
                          </ListItem>
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
                        this.props.onPreviousTrip();
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
                        this.props.onNextTrip();
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
                trips={this.props.ongoingTrips}
                currentTripIndex={this.props.currentOngoingTripIndex}
              />
            )}
            {this.state.pageStatus === PageStatus.Reviews && (
              <Reviews
                tripId={
                  this.props.ongoingTrips[this.props.currentOngoingTripIndex]
                    .tripId
                }
              />
            )}
          </Grid>
        </Grid>
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
    mapTripMessage: state.mapTripMessage
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
