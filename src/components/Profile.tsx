import React from "react";
import { connect } from "react-redux";
import "../styles/MyProfile.css";
// import { myFirestore } from "../config/firebase";
import { Button } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Reviews from "./Reviews";

type myProps = {
  displayProfile: string;
  users: any;
  onChangeDisplayProfile: any;
};

class Profile extends React.Component<
  myProps,
  { user: any; showReview: any; rating: number }
> {
  constructor(props: myProps) {
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
    console.log(reviews);
    let total = 0;
    reviews.forEach(review => {
      total += review.rating;
    });
    console.log(total);
    const averageRating = total / reviews.length;
    console.log(averageRating);
    this.setState({ rating: averageRating });
  };

  componentDidMount() {
    if (this.state.user === undefined && this.props.users.length) {
      this.setState({
        user: this.props.users.find(
          (u: { id: any }) => u.id === this.props.displayProfile
        )
      });
    }
  }

  componentDidUpdate() {
    if (this.state.user === undefined && this.props.users.length) {
      this.setState({
        user: this.props.users.find(
          (u: { id: any }) => u.id === this.props.displayProfile
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
          {this.state.showReview ? (
            <>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={this.onChangeShow}
              >
                Profile
              </Button>
              <Button
                variant="contained"
                color="default"
                size="large"
                onClick={() => {
                  this.props.onChangeDisplayProfile(undefined);
                }}
              >
                Close
              </Button>
              <Reviews userId={this.state.user.id} />
            </>
          ) : (
            <>
              <h1>{this.state.user.nickname}</h1>
              <img src={this.state.user.photoUrl} id="profile-picture" />
              <div className="social-icons">
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
              </div>
              <div id="star-container">
                <Rating
                  value={this.state.rating ? this.state.rating : 0}
                  readOnly
                  precision={0.25}
                  size="large"
                />
              </div>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={this.onChangeShow}
              >
                Reviews
              </Button>
              <br />
              <br />
              <button
                onClick={() => {
                  this.props.onChangeDisplayProfile(undefined);
                }}
              >
                Close
              </button>
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
    displayProfile: state.displayProfile,
    users: state.users
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeDisplayProfile: (profile: string) =>
      dispatch({
        type: "CHANGE_DISPLAY_PROFILE",
        displayProfile: profile
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
