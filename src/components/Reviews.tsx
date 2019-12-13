import { firestore } from "firebase";
import React, { Component } from "react";
import { myFirestore } from "../config/firebase";
import { connect } from "react-redux";

// Material UI & Styles
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

export default class Reviews extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      reviewInfo: []
    };
  }

  async componentDidMount() {
    const result = await myFirestore
      .collection("users")
      .doc(this.props.userId)
      .collection("reviews")
      .get();

    result.docs.forEach(async res => {
      if (this.props.tripId === undefined) {
        await this.setReviewInfo(res);
        return;
      }

      if (this.props.tripId === res.data().tripId.id) {
        await this.setReviewInfo(res);
        return;
      }
    });
  }

  setReviewInfo = async (res: any) => {
    const reviewerResult = await res.data().reviewer.get();
    const reviewerName = reviewerResult.data().nickname;

    const tripResult = await res.data().tripId.get();
    const tripName = tripResult.data().name;

    const reviews = await res.data().message;
    const rating = await res.data().rating;
    this.setState({
      reviewInfo: [
        ...this.state.reviewInfo,
        {
          tripName,
          reviewer: reviewerName,
          reviews,
          rating
        }
      ]
    });
  };

  render() {
    return (
      <div className="reviews">
        {/* <p>Reviews</p> */}
        <List>
          {this.state.reviewInfo.map((review: any, index: any) => {
            return (
              <div key={index}>
                {index > 0 && <Divider />}
                {/* <Divider /> */}
                <ListItem>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <p>
                          <b>TripName:</b> {review.tripName}
                        </p>
                        <p>
                          <b>Reviewer:</b> {review.reviewer}
                        </p>
                        <p>
                          <b>Rating</b>
                        </p>
                        <Rating
                          name="readOnly"
                          value={review.rating}
                          readOnly
                        />

                        <p>
                          <b>Review for you</b>
                        </p>
                        <p>{review.reviews}</p>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </div>
            );
          })}
        </List>
      </div>
    );
  }
}