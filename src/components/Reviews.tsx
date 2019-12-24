// import { firestore } from "firebase";
import React, { Component } from "react";
import { myFirestore } from "../config/firebase";
import moment from "moment";

// Material UI & Styles
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Typography
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import "../styles/Reviews.css";

interface Review {
  tripName: string;
  reviewer: string;
  reviews: string;
  rating: number;
  date: string;
}

interface ReviewsState {
  reviewInfo: Review[];
  isLoading: boolean;
}

interface ReviewsProps {
  userId: string;
  tripId?: string;
}

export default class Reviews extends Component<ReviewsProps, ReviewsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      reviewInfo: [],
      isLoading: true
    };
  }

  async componentDidMount() {
    const result = await myFirestore
      .collection("users")
      .doc(this.props.userId)
      .collection("reviews")
      .get();

    await result.docs.forEach(async res => {
      if (this.props.tripId === null || this.props.tripId === undefined) {
        await this.setReviewInfo(res);
        return;
      }

      if (this.props.tripId === res.data().tripId.id) {
        await this.setReviewInfo(res);
        return;
      }
    });

    this.setState({
      isLoading: false
    });
  }

  setReviewInfo = async (res: firebase.firestore.QueryDocumentSnapshot) => {
    const reviewerResult = await res.data().reviewer.get();
    const reviewerName = reviewerResult.data().nickname;

    const tripResult = await res.data().tripId.get();
    if (!tripResult.exists) return; // If past trips delete, skip the info
    const tripName = tripResult.data().name;

    const reviews = await res.data().message;
    const rating = await res.data().rating;
    let date = await res.data().date;
    date = moment(date.toDate()).format("YYYY-MM-DD HH:mm");
    this.setState({
      reviewInfo: [
        ...this.state.reviewInfo,
        {
          tripName,
          reviewer: reviewerName,
          reviews,
          rating,
          date
        }
      ]
    });
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <div className="reviews">
          {/* <p>Reviews</p> */}
          <List>
            {this.state.reviewInfo.map((review: Review, index: number) => {
              return (
                <div key={index}>
                  {index > 0 && <Divider />}
                  {/* <Divider /> */}
                  <ListItem>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Rating
                            id="medium-star"
                            size="small"
                            name="readOnly"
                            value={review.rating}
                            readOnly
                          />
                          <Typography variant="h6">
                            <b>Trip Name:</b> {review.tripName}
                          </Typography>
                          <Typography variant="body1">
                            {review.reviews}
                          </Typography>
                        </React.Fragment>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2">
                            by {review.reviewer}
                          </Typography>
                          <Typography variant="body2">
                            Date: {review.date}
                          </Typography>
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
    } else {
      return (
        <div>
          <CircularProgress />
          <p>Loading... Please try again shortly.</p>
        </div>
      );
    }
  }
}
