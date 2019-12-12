import { firestore } from "firebase";
import React, { Component } from "react";
import { myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import {
  setMessages,
  clearMessages,
  setMessageListener
} from "../redux/action";

// Material UI & Styles
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class Reviews extends Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      reviewInfo: []
    };
  }

  async componentDidMount() {
    const result = await myFirestore
      .collection("trips")
      .where("memberIds", "array-contains", this.props.userId)
      .get();

    const tripIds: any[] = [];
    const tripNames: any[] = [];
    result.docs.forEach(res => {
      tripIds.push(res.id);
      tripNames.push(res.data().name);
    });

    const tmpReviewInfo: any[] = [];
    tripIds.forEach(async (tripId, index) => {
      const result = await myFirestore
        .collection("trips")
        .doc(tripId)
        .collection("reviews")
        .get();

      if (result.size > 0) {
        await result.forEach(async res => {
          // Get reviewee name
          const revieweeResult = await res.data().reviewee.get();
          const revieweeName = revieweeResult.data().nickname;

          // Get reviewer name
          const reviewerResult = await res.data().reviewer.get();
          const reviewerName = reviewerResult.data().nickname;

          const reviews = await res.data().message;
          const rating = await res.data().rating;

          console.log(tripNames[index], revieweeName, reviewerName, reviews);
          this.setState({
            reviewInfo: [
              ...this.state.reviewInfo,
              {
                tripName: tripNames[index],
                reviewee: revieweeName,
                reviewer: reviewerName,
                reviews,
                rating
              }
            ]
          });
          console.log("OK!!");
        });
      }
    });
  }

  render() {
    return (
      <div className="reviews">
        <p>Reviews</p>
        <List>
          {this.state.reviewInfo.map((review: any, index: any) => {
            return (
              <div key={index}>
                {/* {index > 0 && <Divider />} */}
                <Divider />
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

const mapStateToProps = (state: any) => ({
  userId: state.userId
});

const mapDispatchToProps = (dispatch: any) => ({
  clearMessage: () => {}
});

export default connect(mapStateToProps, mapDispatchToProps)(Reviews);
