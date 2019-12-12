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

    const tripIds = result.docs.map(res => res.id);
    tripIds.forEach(async tripId => {
      const result = await myFirestore
        .collection("trips")
        .doc(tripId)
        .collection("reviews")
        .get();

      result.forEach(res => {
        console.log(res.data());
      });
    });
  }

  render() {
    return (
      <div className="reviews">
        <p>Reviews</p>
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
