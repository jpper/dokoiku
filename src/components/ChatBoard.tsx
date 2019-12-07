import moment from "moment";
import uuidv4 from "uuid/v4";
import firebase, { firestore } from "firebase";
import React, { Component } from "react";
// import ReactLoading from "react-loading";
import { myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setMessages } from "../redux/action";

// Material UI & Styles
import {
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Card
} from "@material-ui/core";
import "../styles/ChatBoard.css";

const mapStateToProps = (state: any) => ({
  userId: state.userId,
  userName: state.userName,
  tripId: state.trips[state.currentTrip].tripId,
  tripMessages: state.currentTripMessages
});

const mapDispatchToProps = (dispatch: any) => ({
  getMessages: (tripId: string) => {
    myFirestore
      .collection("trips")
      .doc(tripId)
      .collection("messages")
      .onSnapshot(
        snapShot => {
          snapShot.docChanges().forEach(change => {
            if (change.type === "added") {
              change.doc
                .data()
                .fromId.get()
                .then((doc: any) => {
                  const msg = change.doc.data();
                  msg.nickname = doc.data().nickname;
                  msg.photoUrl = doc.data().photoUrl;
                  console.log(msg);
                  dispatch(setMessages(msg));
                });
            }
          });
        },
        err => {
          console.log(err.toString());
        }
      );
  },
  sendMessage: (tripId: string, userId: string, messageToBeSent: string) => {
    // const moment = firestore.FieldValue.serverTimestamp();
    const moment = firestore.Timestamp.fromDate(new Date());
    const message = {
      content: messageToBeSent,
      fromId: myFirestore.doc("users/" + userId),
      moment
    };
    myFirestore
      .collection("trips")
      .doc(tripId)
      .collection("messages")
      .doc(uuidv4())
      .set(message)
      .then(() => {
        console.log("successful!");
      })
      .catch(err => {
        console.log(err);
      });
  }
});

interface ChatBoardState {
  messageListener: Function | null;
  groupMemberListener: Function | null;
  messageToBeSent: string;
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

class ChatBoard extends Component<Props, ChatBoardState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      messageListener: null,
      groupMemberListener: null,
      messageToBeSent: ""
    };
  }
  async componentDidMount() {
    await this.props.getMessages(this.props.tripId);
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      messageToBeSent: e.currentTarget.value
    });
  }

  clearMessage() {
    this.setState({
      messageToBeSent: ""
    });
  }

  render() {
    return (
      <div className="ChatBoard">
        <Container>
          <Card className="card">
            <List>
              {this.props.tripMessages.length ? (
                this.props.tripMessages
                  .sort((a: any, b: any) => a.moment.seconds - b.moment.seconds)
                  .map((msg: any) => (
                    <>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src={msg.photoUrl} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={msg.content}
                          secondary={
                            <React.Fragment>
                              <div>{msg.nickname}</div>
                              <div>{moment(msg.moment.toDate()).fromNow()}</div>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </>
                  ))
              ) : (
                <div></div>
              )}
            </List>
          </Card>

          <form>
            <label htmlFor="message"></label>
            <input
              type="text"
              id="message"
              value={this.state.messageToBeSent}
              onChange={e => this.handleChange(e)}
            ></input>
            <button
              type="button"
              onClick={() => {
                this.clearMessage();
                this.props.sendMessage(
                  this.props.tripId,
                  this.props.userId,
                  this.state.messageToBeSent
                );
              }}
            >
              Send Message!
            </button>
          </form>
        </Container>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoard);
