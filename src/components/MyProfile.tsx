import React from "react";
import { connect } from "react-redux";
import "../styles/MyProfile.css";
import { myFirestore } from "../config/firebase";
import { Button } from "@material-ui/core";

type myProps = {
  userId: string;
  users: any;
};

class MyProfile extends React.Component<myProps, { user: any }> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      user: undefined
    };
  }

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

  render() {
    if (this.state.user) {
      return (
        <div className="MyProfile">
          <h1>{this.state.user.nickname}</h1>
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
              <p>Add a link to your Facebook</p>
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
              <p>Add a link to your Instagram</p>
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
              <p>Add a link to your Twitter</p>
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
          <div id="star-container">⭐️⭐️⭐️⭐️⭐️</div>
          <Button variant="contained" color="secondary" size="large">
            Reviews
          </Button>
          <br />
          <Button variant="contained" color="secondary" size="large">
            Past Trips
          </Button>
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
    users: state.users
  };
};

export default connect(mapStateToProps)(MyProfile);
