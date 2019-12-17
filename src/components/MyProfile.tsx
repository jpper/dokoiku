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
  TextField
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

class MyProfile extends React.Component<
  myProps,
  {
    user: any;
    showReview: any;
    rating: number;
    userCurrencyCode: string;
    toggleDialog: boolean;
    aboutMeText: string;
  }
> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      user: undefined,
      showReview: false,
      rating: undefined,
      userCurrencyCode: this.props.userCurrencyCode,
      toggleDialog: false,
      aboutMeText: undefined
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

  handleToggle = () => {
    this.setState({
      toggleDialog: !this.state.toggleDialog
    });
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
                <ListItem
                  className="listItem itemTextCentering"
                  id="listItem-facebook"
                  button
                  onClick={() => {
                    const modal = document.getElementById("add-facebook");
                    modal.style.display = "block";
                  }}
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

                <ListItem
                  button
                  className="listItem itemTextCentering"
                  id="listItem-twitter"
                  onClick={() => {
                    const modal = document.getElementById("add-twitter");
                    modal.style.display = "block";
                  }}
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
                  onClick={() => {
                    const modal = document.getElementById("add-instagram");
                    modal.style.display = "block";
                  }}
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
              {/* FACEBOOK */}
              <div className="modal" id="add-facebook">
                <div className="modal-content">
                  <p>Add a link to your Facebook:</p>
                  <h4>
                    This information will be visible to members of your trips.
                  </h4>
                  <input id="fb-url" placeholder="Paste URL here" />
                  <button
                    onClick={() => {
                      const url = (document.getElementById(
                        "fb-url"
                      ) as HTMLInputElement).value;
                      myFirestore
                        .collection("users")
                        .doc(this.props.userId)
                        .update({ facebook: url });
                      const modal = document.getElementById("add-facebook");
                      modal.style.display = "none";
                    }}
                  >
                    Submit
                  </button>
                  <br></br>
                  <br></br>
                  <button
                    className="close"
                    onClick={() => {
                      const modal = document.getElementById("add-facebook");
                      modal.style.display = "none";
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
              {/* INSTAGRAM */}
              <div className="modal" id="add-instagram">
                <div className="modal-content">
                  <p>Add a link to your Instagram:</p>
                  <h4>
                    This information will be visible to members of your trips.
                  </h4>
                  <input id="instagram-url" placeholder="Paste URL here" />
                  <button
                    onClick={() => {
                      const url = (document.getElementById(
                        "instagram-url"
                      ) as HTMLInputElement).value;
                      myFirestore
                        .collection("users")
                        .doc(this.props.userId)
                        .update({ instagram: url });
                      const modal = document.getElementById("add-instagram");
                      modal.style.display = "none";
                    }}
                  >
                    Submit
                  </button>
                  <br></br>
                  <br></br>
                  <button
                    className="close"
                    onClick={() => {
                      const modal = document.getElementById("add-instagram");
                      modal.style.display = "none";
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
              {/* TWITTER */}
              <div className="modal" id="add-twitter">
                <div className="modal-content">
                  <p>Add a link to your Twitter:</p>
                  <h4>
                    This information will be visible to members of your trips.
                  </h4>
                  <input id="twitter-url" placeholder="Paste URL here" />
                  <button
                    onClick={() => {
                      const url = (document.getElementById(
                        "twitter-url"
                      ) as HTMLInputElement).value;
                      myFirestore
                        .collection("users")
                        .doc(this.props.userId)
                        .update({ twitter: url });
                      const modal = document.getElementById("add-twitter");
                      modal.style.display = "none";
                    }}
                  >
                    Submit
                  </button>
                  <br></br>
                  <br></br>
                  <button
                    className="close"
                    onClick={() => {
                      const modal = document.getElementById("add-twitter");
                      modal.style.display = "none";
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="spacer10"></div>

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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    myFirestore
                      .collection("users")
                      .doc(this.props.userId)
                      .update({ aboutMe: this.state.aboutMeText });
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.props.updateUserCurrencyCode(
                        this.state.userCurrencyCode,
                        this.props.userId
                      );
                      this.handleToggle();
                    }}
                  >
                    Change
                  </Button>
                       
                </FormControl>
              </div>
              <Dialog
                open={this.state.toggleDialog}
                onClose={this.handleToggle}
              >
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    You have changed your currency to{" "}
                    {
                      countriesToCurrencies.find(
                        (item: any) =>
                          item.currencyCode === this.state.userCurrencyCode
                      ).currency
                    }
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleToggle}>Close</Button>
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
