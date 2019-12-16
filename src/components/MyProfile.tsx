import React from "react";
import { connect } from "react-redux";
import "../styles/MyProfile.css";
import { myFirestore } from "../config/firebase";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Reviews from "./Reviews";
import { setPageTabIndex } from "../redux/action";
import countriesToCurrencies from "../data/countries_to_currencies.json";
import _ from "lodash";

type myProps = {
  userId: string;
  users: any;
  userCurrencyCode: string;
  setPageTabIndex: any;
};

class MyProfile extends React.Component<
  myProps,
  { user: any; showReview: any; rating: number; userCurrencyCode: string }
> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      user: undefined,
      showReview: false,
      rating: undefined,
      userCurrencyCode: this.props.userCurrencyCode
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

  render() {
    if (this.state.user) {
      this.calculateRating(this.props.userId);
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
              <Reviews userId={this.state.user.id} />
            </>
          ) : (
            <>
              <h1>{this.state.user.nickname}</h1>
              <h1>
                {"The currency I use: " +
                  countriesToCurrencies.find(
                    (item: any) =>
                      item.currencyCode === this.state.userCurrencyCode
                  ).currency}
              </h1>
              <FormControl>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={this.state.userCurrencyCode}
                  onChange={e => {
                    this.setState({ userCurrencyCode: String(e.target.value) });
                  }}
                >
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
                <div id="helper-text">Cannot be changed once chosen</div>
              </FormControl>
              <br />
              <img src={this.state.user.photoUrl} id="profile-picture" />
              <div className="social-icons">
                {/* FACEBOOK */}
                {this.state.user.facebook ? (
                  <img
                    src="https://www.facebook.com/images/fb_icon_325x325.png"
                    alt="Facebook"
                    id="social-icon"
                    onClick={() => {
                      const modal = document.getElementById("add-facebook");
                      modal.style.display = "block";
                    }}
                  />
                ) : (
                  <img
                    src="https://www.facebook.com/images/fb_icon_325x325.png"
                    alt="Facebook"
                    id="no-social-icon"
                    onClick={() => {
                      const modal = document.getElementById("add-facebook");
                      modal.style.display = "block";
                    }}
                  />
                )}
                {/* INSTA */}
                {this.state.user.instagram ? (
                  <img
                    src="https://www.parkviewbaptist.com/wp-content/uploads/2019/09/Instagram-Icon.png"
                    alt="Instagram"
                    id="social-icon"
                    onClick={() => {
                      const modal = document.getElementById("add-instagram");
                      modal.style.display = "block";
                    }}
                  />
                ) : (
                  <img
                    src="https://www.parkviewbaptist.com/wp-content/uploads/2019/09/Instagram-Icon.png"
                    alt="Instagram"
                    id="no-social-icon"
                    onClick={() => {
                      const modal = document.getElementById("add-instagram");
                      modal.style.display = "block";
                    }}
                  />
                )}
                {/* TWITTER */}
                {this.state.user.twitter ? (
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-twitter-512.png"
                    alt="Twitter"
                    id="social-icon"
                    onClick={() => {
                      const modal = document.getElementById("add-twitter");
                      modal.style.display = "block";
                    }}
                  />
                ) : (
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-twitter-512.png"
                    alt="Twitter"
                    id="no-social-icon"
                    onClick={() => {
                      const modal = document.getElementById("add-twitter");
                      modal.style.display = "block";
                    }}
                  />
                )}
              </div>
              {/* MODALS SECTION */}
              {/* FACEBOOK */}
              <div className="modal" id="add-facebook">
                <div className="modal-content">
                  <p>Add a link to your Facebook:</p>
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
              <div id="star-container">
                <Rating
                  value={this.state.rating}
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
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => this.props.setPageTabIndex(5)}
              >
                Past Trips
              </Button>
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
