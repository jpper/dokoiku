import moment from "moment";
import uuidv4 from "uuid/v4";
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
import {
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Card,
  TextField,
  Button,
  Grid,
  GridList
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import "../styles/ChatBoard.css";

const mapStateToProps = (state: any) => ({
  userId: state.userId,
  userName: state.userName,
  tripMessages: state.currentTripMessages,
  messageListener: state.messageListener
});

const mapDispatchToProps = (dispatch: any) => ({
  clearMessage: () => {
    dispatch(clearMessages());
  },
  clearListener: (listener: any) => {
    if (listener !== undefined) {
      // Stop listening for changes
      listener();
      dispatch(setMessageListener(undefined));
    }
  },
  getMessages: (tripId: string) => {
    const messageListener = myFirestore
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
                  dispatch(setMessages(msg));
                });
            }
          });
        },
        err => {
          console.log(err.toString());
        }
      );
    dispatch(setMessageListener(messageListener));
  },
  sendMessage: (tripId: string, userId: string, messageToBeSent: string) => {
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
  ReturnType<typeof mapDispatchToProps> & {
    tripId: any;
  };

class ChatBoard extends Component<Props, ChatBoardState> {
  private messagesEnd: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      messageListener: null,
      groupMemberListener: null,
      messageToBeSent: ""
    };
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }
  async componentDidMount() {
    await this.props.clearMessage();
    await this.props.clearListener(this.props.messageListener);

    await this.props.getMessages(this.props.tripId);

    this.scrollToBottom();
  }

  handleChange(e: any) {
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
        <GridList cellHeight={700} cols={1}>
          <Container>
            <Card className="card">
              <List>
                {this.props.tripMessages.length ? (
                  this.props.tripMessages.map((msg: any) => (
                    <div key={msg.moment.seconds}>
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
                    </div>
                  ))
                ) : (
                  <div></div>
                )}
              </List>
            </Card>

            <div
              style={{ float: "left", clear: "both" }}
              ref={el => {
                this.messagesEnd = el;
              }}
            ></div>

            <Grid container>
              <Grid item xs={10}>
                <TextField
                  id="outlined-basic"
                  label="Message"
                  variant="outlined"
                  autoFocus
                  value={this.state.messageToBeSent}
                  onChange={e => this.handleChange(e)}
                  fullWidth
                  style={{
                    backgroundColor: "white"
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                {this.state.messageToBeSent === "" ? (
                  <Button
                    type="button"
                    variant="contained"
                    size="large"
                    disabled
                    fullWidth
                    className="button"
                  >
                    <SendIcon />
                    Send
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    className="button"
                    onClick={() => {
                      this.clearMessage();
                      this.props.sendMessage(
                        this.props.tripId,
                        this.props.userId,
                        this.state.messageToBeSent
                      );
                    }}
                  >
                    <SendIcon />
                    Send
                  </Button>
                )}
              </Grid>
            </Grid>
          </Container>
        </GridList>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoard);
