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
  private messagesEnd: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      test: ""
    };
  }

  render() {
    return (
      <div className="ChatBoard">
        <p>ReviewEditor</p>
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
