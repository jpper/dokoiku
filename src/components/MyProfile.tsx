import React from "react";
import { connect } from "react-redux";
import "../styles/MyProfile.css";
import { myFirestore } from "../config/firebase";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Modal,
  Backdrop,
  Box,
  Fade
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Reviews from "./Reviews";
import { setPageTabIndex, setUserCurrencyCode } from "../redux/action";
import countriesToCurrencies from "../data/countries_to_currencies.json";
import _ from "lodash";
import "typeface-roboto";

type myProps = {
  userId: string;
  users: any;
  userCurrencyCode: string;
  setPageTabIndex: any;
  updateUserCurrencyCode: any;
};

enum snsTypes {
  None,
  Facebook,
  Twitter,
  Instagram,
  Photo
}

type myStates = {
  user: any;
  showReview: any;
  rating: number;
  userCurrencyCode: string;
  toggleCurrencyDialog: boolean;
  toggleBioDialog: boolean;
  aboutMeText: string;
  snsType: snsTypes;
  snsUrl: string;
};

class MyProfile extends React.Component<myProps, myStates> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      user: undefined,
      showReview: false,
      rating: undefined,
      userCurrencyCode: this.props.userCurrencyCode,
      toggleCurrencyDialog: false,
      toggleBioDialog: false,
      aboutMeText: undefined,
      snsType: snsTypes.None,
      snsUrl: ""
    };
  }

  calculateRating = async (id: string) => {
    const reviews = await myFirestore
      .collection("users")
      .doc(id)
      .collection("reviews")
      .get()
      .then(query => query.docs.map(review => review.data()));
    let total = 0;
    reviews.forEach(review => {
      total += review.rating;
    });
    const averageRating = total / reviews.length;
    this.setState({ rating: averageRating });
  };

  componentDidMount() {
    if (this.state.user === undefined && this.props.users.length) {
      this.setState({
        user: this.props.users.find(
          (u: { id: any }) => u.id === this.props.userId
        )
      });
    }
  }

  componentDidUpdate() {
    if (this.state.user === undefined && this.props.users.length) {
      this.setState({
        user: this.props.users.find(
          (u: { id: any }) => u.id === this.props.userId
        )
      });
    }
  }

  onChangeShow = () => {
    this.setState({
      showReview: !this.state.showReview
    });
  };

  handleToggleCurrencyDialog = () => {
    this.setState({
      toggleCurrencyDialog: !this.state.toggleCurrencyDialog
    });
  };

  handleToggleBioDialog = () => {
    this.setState({
      toggleBioDialog: !this.state.toggleBioDialog
    });
  };

  clearSnsType = () => {
    this.setState({
      snsType: snsTypes.None
    });
    this.setState({
      snsUrl: ""
    });
  };

  clickPhoto = () => {
    this.setState({
      snsType: snsTypes.Photo
    });
  };

  updatePhotoUrl = () => {
    myFirestore
      .collection("users")
      .doc(this.props.userId)
      .update({ photoUrl: this.state.snsUrl });

    this.clearSnsType();
  };

  clickFacebook = () => {
    this.setState({
      snsType: snsTypes.Facebook
    });
  };

  updateFacebookUrl = () => {
    myFirestore
      .collection("users")
      .doc(this.props.userId)
      .update({ facebook: this.state.snsUrl });

    this.clearSnsType();
  };

  clickTwitter = () => {
    this.setState({
      snsType: snsTypes.Twitter
    });
  };

  updateTwitterUrl = () => {
    myFirestore
      .collection("users")
      .doc(this.props.userId)
      .update({ twitter: this.state.snsUrl });

    this.clearSnsType();
  };

  clickInstagram = () => {
    this.setState({
      snsType: snsTypes.Instagram
    });
  };

  updateInstagramUrl = () => {
    myFirestore
      .collection("users")
      .doc(this.props.userId)
      .update({ instagram: this.state.snsUrl });

    this.clearSnsType();
  };

  render() {
    if (this.state.user && this.state.userCurrencyCode) {
      this.calculateRating(this.props.userId);
      return (
        <div className="MyProfile">
          {this.state.showReview ? (
            <>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={this.onChangeShow}
              >
                Go back to Profile
              </Button>
              <Reviews userId={this.state.user.id} />
            </>
          ) : (
            <>
              <div className="spacer10"></div>
              <img
                src={this.state.user.photoUrl}
                id="profile-picture"
                alt={this.state.user.nickname}
                onClick={this.clickPhoto}
              />
              <div className="spacer10"></div>

              <Typography variant="h4" align="center">
                <b>{this.state.user.nickname}</b>
              </Typography>

              <Grid
                container
                alignContent="center"
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <Rating
                    value={this.state.rating ? this.state.rating : 0}
                    readOnly
                    precision={0.25}
                    size="large"
                  />
                </Grid>
              </Grid>

              <div className="spacer10"></div>

              <List id="horizontal-list">
                {/* Facebook */}
                <ListItem
                  className="listItem itemTextCentering"
                  id="listItem-facebook"
                  button
                  onClick={this.clickFacebook}
                >
                  <ListItemText
                    primary={
                      <React.Fragment>
                        {/* FACEBOOK */}
                        {this.state.user.facebook ? (
                          <img
                            src="https://www.facebook.com/images/fb_icon_325x325.png"
                            alt="Facebook"
                            id="social-icon"
                          />
                        ) : (
                          <img
                            src="https://www.facebook.com/images/fb_icon_325x325.png"
                            alt="Facebook"
                            id="no-social-icon"
                          />
                        )}
                      </React.Fragment>
                    }
                    secondary="Facebook"
                  />
                </ListItem>

                {/* Twitter */}
                <ListItem
                  button
                  className="listItem itemTextCentering"
                  id="listItem-twitter"
                  onClick={this.clickTwitter}
                >
                  <ListItemText
                    primary={
                      <React.Fragment>
                        {/* TWITTER */}
                        {this.state.user.twitter ? (
                          <img
                            src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-twitter-512.png"
                            alt="Twitter"
                            id="social-icon"
                          />
                        ) : (
                          <img
                            src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-twitter-512.png"
                            alt="Twitter"
                            id="no-social-icon"
                          />
                        )}
                      </React.Fragment>
                    }
                    secondary="Twitter"
                  />
                </ListItem>

                <ListItem
                  id="listItem-instagram"
                  className="itemTextCentering"
                  button
                  onClick={this.clickInstagram}
                >
                  <ListItemText
                    primary={
                      <React.Fragment>
                        {/* INSTA */}
                        {this.state.user.instagram ? (
                          <img
                            src="https://www.parkviewbaptist.com/wp-content/uploads/2019/09/Instagram-Icon.png"
                            alt="Instagram"
                            id="social-icon"
                          />
                        ) : (
                          <img
                            src="https://www.parkviewbaptist.com/wp-content/uploads/2019/09/Instagram-Icon.png"
                            alt="Instagram"
                            id="no-social-icon"
                          />
                        )}
                      </React.Fragment>
                    }
                    secondary="Instagram"
                  />
                </ListItem>
              </List>

              {/* MODALS SECTION */}
              {/* Photo URL */}
              <Modal
                className="modalWindow"
                open={this.state.snsType === snsTypes.Photo}
                onClose={this.clearSnsType}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500
                }}
              >
                <Fade in={this.state.snsType === snsTypes.Photo}>
                  <div className="modalFade">
                    <Box
                      component="fieldset"
                      mb={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="h5">
                        Change your profile picture
                      </Typography>
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <TextField
                        placeholder="Write your Photo URL"
                        label="Your Photo URL"
                        rows={10}
                        fullWidth
                        onChange={e => {
                          this.setState({
                            snsUrl: e.target.value
                          });
                        }}
                        value={this.state.snsUrl}
                      />
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.updatePhotoUrl}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        color="default"
                        onClick={this.clearSnsType}
                      >
                        Close
                      </Button>
                    </Box>
                  </div>
                </Fade>
              </Modal>

              {/* Facebook URL */}
              <Modal
                className="modalWindow"
                open={this.state.snsType === snsTypes.Facebook}
                onClose={this.clearSnsType}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500
                }}
              >
                <Fade in={this.state.snsType === snsTypes.Facebook}>
                  <div className="modalFade">
                    <Box
                      component="fieldset"
                      mb={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="h5">
                        Add a link to your Facebook:
                      </Typography>
                    </Box>
                    <Box
                      component="fieldset"
                      mt={0}
                      mb={0}
                      pt={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="body1">
                        This information will be visible to members of your
                        trips.
                      </Typography>
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <TextField
                        label="Facebook URL"
                        placeholder="Write your Facebook URL"
                        rows={10}
                        fullWidth
                        onChange={e => {
                          this.setState({
                            snsUrl: e.target.value
                          });
                        }}
                        value={this.state.snsUrl}
                      />
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.updateFacebookUrl}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        color="default"
                        onClick={this.clearSnsType}
                      >
                        Close
                      </Button>
                    </Box>
                  </div>
                </Fade>
              </Modal>

              {/* Twitter URL */}
              <Modal
                className="modalWindow"
                open={this.state.snsType === snsTypes.Twitter}
                onClose={this.clearSnsType}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500
                }}
              >
                <Fade in={this.state.snsType === snsTypes.Twitter}>
                  <div className="modalFade">
                    <Box
                      component="fieldset"
                      mb={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="h5">
                        Add a link to your Twitter:
                      </Typography>
                    </Box>
                    <Box
                      component="fieldset"
                      mt={0}
                      mb={0}
                      pt={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="body1">
                        This information will be visible to members of your
                        trips.
                      </Typography>
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <TextField
                        label="Twitter URL"
                        placeholder="Write your Twitter URL"
                        fullWidth
                        rows={10}
                        onChange={e => {
                          this.setState({
                            snsUrl: e.target.value
                          });
                        }}
                        value={this.state.snsUrl}
                      />
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.updateTwitterUrl}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        color="default"
                        onClick={this.clearSnsType}
                      >
                        Close
                      </Button>
                    </Box>
                  </div>
                </Fade>
              </Modal>

              {/* INSTAGRAM */}
              <Modal
                className="modalWindow"
                open={this.state.snsType === snsTypes.Instagram}
                onClose={this.clearSnsType}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500
                }}
              >
                <Fade in={this.state.snsType === snsTypes.Instagram}>
                  <div className="modalFade">
                    <Box
                      component="fieldset"
                      mb={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="h5">
                        Add a link to your Instagram:
                      </Typography>
                    </Box>
                    <Box
                      component="fieldset"
                      mt={0}
                      mb={0}
                      pt={0}
                      pb={0}
                      borderColor="transparent"
                    >
                      <Typography variant="body1">
                        This information will be visible to members of your
                        trips.
                      </Typography>
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <TextField
                        label="Instagram URL"
                        placeholder="Write your Instagram URL"
                        rows={10}
                        fullWidth
                        onChange={e => {
                          this.setState({
                            snsUrl: e.target.value
                          });
                        }}
                        value={this.state.snsUrl}
                      />
                    </Box>
                    <Box component="fieldset" mb={0} borderColor="transparent">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.updateInstagramUrl}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="contained"
                        color="default"
                        onClick={this.clearSnsType}
                      >
                        Close
                      </Button>
                    </Box>
                  </div>
                </Fade>
              </Modal>

              <div className="spacer10"></div>
              <br />
              <div id="about-me-container">
                <TextField
                  id="about-me"
                  variant="outlined"
                  multiline
                  label="About Me"
                  rows="3"
                  defaultValue={this.state.user.aboutMe}
                  onChange={(e: any) => {
                    this.setState({ aboutMeText: e.currentTarget.value });
                  }}
                />
                <br />
                <br />
                <Button
                  style={{ width: "100px" }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    if (this.state.aboutMeText) {
                      myFirestore
                        .collection("users")
                        .doc(this.props.userId)
                        .update({ aboutMe: this.state.aboutMeText });

                      this.handleToggleBioDialog();
                    }
                  }}
                >
                  Update
                </Button>
              </div>

              <br />

              {/* <Typography variant="h6" align="center">
                {"The currency I use: " +
                  countriesToCurrencies.find(
                    (item: any) =>
                      item.currencyCode === this.state.userCurrencyCode
                  ).currency}
              </Typography> */}
              <div id="currency-selector-container">
                <FormControl id="currency-selector">
                  <InputLabel>The currency I use: </InputLabel>
                  <Select
                    value={this.state.userCurrencyCode}
                    onChange={e => {
                      this.setState({
                        userCurrencyCode: String(e.target.value)
                      });
                    }}
                  >
                    <MenuItem value={"None"}>{"None"}</MenuItem>                
                    {_.uniqBy(countriesToCurrencies, "currencyCode")
                      .sort((a: any, b: any) => {
                        if (a.currency > b.currency) return 1;
                        else return -1;
                      })
                      .map((item: any) => (
                        <MenuItem value={item.currencyCode}>
                          {item.currency}                    
                        </MenuItem>
                      ))}
                           
                  </Select>
                       
                </FormControl>
                <br />
                <Button
                  style={{ width: "100px" }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.props.updateUserCurrencyCode(
                      this.state.userCurrencyCode,
                      this.props.userId
                    );
                    this.handleToggleCurrencyDialog();
                  }}
                >
                  Update
                </Button>
              </div>
              <Dialog
                open={this.state.toggleCurrencyDialog}
                onClose={this.handleToggleCurrencyDialog}
              >
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You just changed your currency to{" "}
                    {
                      countriesToCurrencies.find(
                        (item: any) =>
                          item.currencyCode === this.state.userCurrencyCode
                      ).currency
                    }
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleToggleCurrencyDialog}>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={this.state.toggleBioDialog}
                onClose={this.handleToggleBioDialog}
              >
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You just updated your About Me!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleToggleBioDialog}>Close</Button>
                </DialogActions>
              </Dialog>

              <div className="spacer10"></div>
              <div className="spacer10"></div>

              <Grid container>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={this.onChangeShow}
                  >
                    Reviews
                  </Button>
                </Grid>

                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    onClick={() => this.props.setPageTabIndex(5)}
                  >
                    Past Trips
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </div>
      );
    } else {
      return "Please log in.";
    }
  }
}

const mapStateToProps = (state: any) => {
  return {
    userId: state.userId,
    users: state.users,
    userCurrencyCode: state.userCurrencyCode
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setPageTabIndex: (index: any) => {
    dispatch(setPageTabIndex(index));
  },
  updateUserCurrencyCode: (currencyCode: string, userId: string) => {
    myFirestore
      .collection("users")
      .doc(userId)
      .update({ currencyCode });
    dispatch(setUserCurrencyCode(currencyCode));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
