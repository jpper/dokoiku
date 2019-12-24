import React, { Dispatch } from "react";
import { connect } from "react-redux";
import { User } from "../redux/stateTypes";
import "../styles/MyProfile.css";
// import { myFirestore } from "../config/firebase";
import {
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Link,
  Divider
} from "@material-ui/core";
import { myFirestore } from "../config/firebase";
import Rating from "@material-ui/lab/Rating";
import Reviews from "./Reviews";
import "typeface-roboto";

type myProps = {
  displayProfile: string;
  users: User[];
};

type myStates = {
  user: User;
  showReview: boolean;
  rating: number;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class ProfilePopover extends React.Component<Props, myStates> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: undefined,
      showReview: false,
      rating: undefined
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
          (u: { id: string }) => u.id === this.props.displayProfile
        )
      });
    }
  }

  componentDidUpdate() {
    if (this.state.user === undefined && this.props.users.length) {
      this.setState({
        user: this.props.users.find(
          (u: { id: string }) => u.id === this.props.displayProfile
        )
      });
    }
  }

  onChangeShow = () => {
    this.setState({
      showReview: !this.state.showReview
    });
  };

  render() {
    if (this.state.user) {
      this.calculateRating(this.state.user.id);
      return (
        <div className="MyProfile">
          <div className="spacer10"></div>
          <img
            src={this.state.user.photoUrl}
            alt={this.state.user.nickname}
            id="profile-picture-small"
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

          <div id="about-others">
            <h3>{this.state.user.aboutMe}</h3>
          </div>

          <List id="horizontal-list">
            <ListItem
              button
              className="listItem itemTextCentering"
              id="listItem-facebook"
            >
              {/* FACEBOOK */}
              {this.state.user.facebook ? (
                <Link href={this.state.user.facebook} target="_blank">
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <img
                          src="https://www.facebook.com/images/fb_icon_325x325.png"
                          alt="Facebook"
                          id="social-icon"
                        />
                      </React.Fragment>
                    }
                    secondary="Facebook"
                  />
                </Link>
              ) : (
                <ListItemText
                  primary={
                    <React.Fragment>
                      <img
                        src="https://www.facebook.com/images/fb_icon_325x325.png"
                        alt="Facebook"
                        id="no-social-icon"
                      />
                    </React.Fragment>
                  }
                  secondary="Facebook"
                />
              )}
            </ListItem>

            <ListItem
              button
              className="listItem itemTextCentering"
              id="listItem-twitter"
            >
              {/* TWITTER */}
              {this.state.user.twitter ? (
                <Link href={this.state.user.twitter} target="_blank">
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <img
                          src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-twitter-512.png"
                          alt="Twitter"
                          id="social-icon"
                        />
                      </React.Fragment>
                    }
                    secondary="Twitter"
                  />
                </Link>
              ) : (
                <ListItemText
                  primary={
                    <React.Fragment>
                      <img
                        src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-twitter-512.png"
                        alt="Twitter"
                        id="no-social-icon"
                      />
                    </React.Fragment>
                  }
                  secondary="Twitter"
                />
              )}
            </ListItem>

            {/* INSTA */}
            <ListItem
              button
              id="listItem-instagram"
              className="itemTextCentering"
            >
              {this.state.user.instagram ? (
                <Link href={this.state.user.instagram} target="_blank">
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <img
                          src="https://www.parkviewbaptist.com/wp-content/uploads/2019/09/Instagram-Icon.png"
                          alt="Instagram"
                          id="social-icon"
                        />
                      </React.Fragment>
                    }
                    secondary="Instagram"
                  />
                </Link>
              ) : (
                <>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <img
                          src="https://www.parkviewbaptist.com/wp-content/uploads/2019/09/Instagram-Icon.png"
                          alt="Instagram"
                          id="no-social-icon"
                        />
                      </React.Fragment>
                    }
                    secondary="Instagram"
                  />
                </>
              )}
            </ListItem>
          </List>

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
                color="default"
                size="large"
                fullWidth
                onClick={() => {
                  this.props.onChangeDisplayProfile(undefined);
                }}
              >
                Close
              </Button>
            </Grid>
          </Grid>

          <div className="spacer20"></div>

          {this.state.showReview && (
            <>
              <Typography variant="h5">
                <div className="reviews-container">
                  Reviews for {this.state.user.nickname}
                </div>
              </Typography>
              <Divider />
              <Reviews userId={this.state.user.id} />
            </>
          )}
        </div>
      );
    } else {
      return "Please log in.";
    }
  }
}

const mapStateToProps = (state: myProps) => {
  return {
    displayProfile: state.displayProfile,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    onChangeDisplayProfile: (profile: string) =>
      dispatch({
        type: "CHANGE_DISPLAY_PROFILE",
        displayProfile: profile
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePopover);
