import React from "react";
import { connect } from "react-redux";
import "../styles/MyProfile.css";
// import { myFirestore } from "../config/firebase";
import { Button } from "@material-ui/core";

type myProps = {
  displayProfile: string;
  users: any;
  onChangeDisplayProfile: any;
};

class Profile extends React.Component<myProps, { user: any }> {
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

  render() {
    if (this.state.user) {
      return (
        <div className="MyProfile">
          <h1>{this.state.user.nickname}</h1>
          <img
            src={this.state.user.photoUrl}
            id="profile-picture"
            alt="profile"
          />
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
          <div id="star-container">⭐️⭐️⭐️⭐️⭐️</div>
          <Button variant="contained" color="secondary" size="large">
            Reviews
          </Button>
          <br />
          <button
            onClick={() => {
              this.props.onChangeDisplayProfile(undefined);
            }}
          >
            Close
          </button>
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
