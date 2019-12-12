import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { myFirestore } from "../config/firebase";
import BasicTripInfo from "./BasicTripInfo";

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
  Box
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import PersonIcon from "@material-ui/icons/Person";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ChatIcon from "@material-ui/icons/Chat";
import DescriptionIcon from "@material-ui/icons/Description";
import "../styles/TripInfo.css";
import "../styles/PastTripInfo.css";

class PastTripInfo extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      modalStatus: [],
      targetUser: -1,
      rating: 0,
      message: ""
    };
  }

  componentDidMount() {
    let initialStatus = Array(this.props.ongoingTrips.length);
    initialStatus.fill(false);
    this.setState({
      modalStatus: initialStatus
    });
  }

  onClickUser = (index: number) => {
    this.setState({
      targetUser: index
    });
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
      message: ""
    });
  };

  saveReviews = (event: any, reviewee: any) => {
    const tripId = this.props.ongoingTrips[
      this.props.currentOngoingTripIndex
    ].tripId.trim();
    const reviewer = this.props.userId;
    const reviewId = reviewer + "_" + reviewee;
    console.log(reviewee);

    myFirestore
      .collection("trips")
      .doc(tripId)
      .collection("reviews")
      .doc(reviewId)
      .set({
        reviewer: myFirestore.doc("users/" + reviewer),
        reviewee: myFirestore.doc("users/" + reviewee),
        rating: this.state.rating,
        message: this.state.message
      });
  };

  render() {
    return (
      <div className="pastTripInfo">
        <BasicTripInfo
          tripTitle={
            this.props.ongoingTrips[this.props.currentOngoingTripIndex].name
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
            this.props.ongoingTrips[this.props.currentOngoingTripIndex].budget
          }
        />

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
              return (
                //   TODO: skips own data here
                <div key={i}>
                  <ListItem button onClick={() => this.onClickUser(i)}>
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
                        <Box
                          component="fieldset"
                          mb={1}
                          borderColor="transparent"
                        >
                          <Typography component="legend">Rating</Typography>
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
                              this.saveReviews(event, member);
                              this.handleClose();
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
