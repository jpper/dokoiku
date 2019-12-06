import moment from "moment";
import uuidv4 from "uuid/v4";
import firebase, { firestore } from "firebase";
import React, { Component } from "react";
// import ReactLoading from "react-loading";
import { myFirebase, myFirestore } from "../config/firebase";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { setMessages } from "../redux/action";

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
    // Get memberIds
    await this.props.getMessages(this.props.tripId);
    //await this.getGroupMemberInfo(this.state.currentUserId);
    // console.log(this.state.currentPeerUserIds);
    // await this.state.currentPeerUserIds.forEach(id => {
    //   this.getGroupMemberInfo(id);
    //   console.log("GET GROUP MEM INFO: ", id);
    // });
    // await this.getListHistory();
    // this.addNameToMsg();
  }
  // getListHistory = () => {
  //   const messageListener = null;
  //   myFirestore
  //     .collection("trips")
  //     .doc(this.state.tripId)
  //     .collection("messages")
  //     .onSnapshot(
  //       snapShot => {
  //         snapShot.docChanges().forEach(change => {
  //           if (change.type === "added") {
  //             this.setState({
  //               listMessage: [...this.state.listMessage, change.doc.data()]
  //             });
  //           }
  //         });
  //       },
  //       err => {
  //         console.log(err.toString());
  //       }
  //     );
  //   this.setState({
  //     messageListener
  //   });

  //   // // TODO:
  //   // this.addNameToMsg();
  // };
  // getGroupMembers = () => {
  //   const groupMemberListener = null;

  //   myFirestore
  //     .collection("trips")
  //     .doc(this.state.tripId)
  //     .onSnapshot(snapShot => {
  //       console.log(snapShot.data());
  //       this.setState({
  //         currentPeerUserIds: snapShot.data().memberIds
  //       });
  //       console.log("GET GROUP MEMEBERS!");
  //       console.log(this.state.currentPeerUserIds);

  //       this.state.currentPeerUserIds.forEach(id => {
  //         this.getGroupMemberInfo(id);
  //         console.log("GET GROUP MEM INFO: ", id);
  //       });
  //     });
  // };
  // sendMessage = () => {
  //   const content = this.state.message;
  //   const moment = firestore.FieldValue.serverTimestamp();
  //   const message = {
  //     content,
  //     fromId: this.state.currentUserId,
  //     moment
  //   };
  //   myFirestore
  //     .collection("trips")
  //     .doc(this.state.tripId)
  //     .collection("messages")
  //     .doc(uuidv4())
  //     .set(message)
  //     .then(() => {
  //       console.log("successful!");
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      messageToBeSent: e.currentTarget.value
    });
  }
  // getGroupMemberInfo(id: string) {
  //   myFirestore
  //     .collection("users")
  //     .where("id", "==", id)
  //     .get()
  //     .then(snapshot => {
  //       if (snapshot.empty) {
  //         console.log("No matching user");
  //         return;
  //       }
  //       const tmpInfo: any[] = [];
  //       snapshot.forEach((doc: any) => {
  //         tmpInfo.push(doc.data());
  //       });
  //       console.log(tmpInfo);
  //       this.setState({
  //         groupMemberInfo: tmpInfo
  //       });
  //     })
  //     .then(() => {
  //       console.log("GET GROUP MEM INFO!!!!");
  //       console.log(this.state.groupMemberInfo);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }
  // addNameToMsg() {
  //   const tmpList = this.state.listMessage.map(msg => {
  //     const fromId = msg.fromId;
  //     const fromName = this.state.groupMemberInfo.filter((info: any) => {
  //       return info.id === fromId;
  //     })[0].nickname;
  //     msg.fromName = fromName;
  //     return msg;
  //   });
  //   this.setState({ listMessage: tmpList });
  //   console.log(this.state.listMessage);
  // }
  render() {
    return (
      <div className="ChatBoard">
        {this.props.tripMessages.length ? (
          this.props.tripMessages
            .sort((a: any, b: any) => a.moment.seconds - b.moment.seconds)
            .map((msg: any) => (
              <div>
                <div>{moment(msg.moment.toDate()).fromNow()}</div>
                <div>{msg.nickname}</div>
                <img src={msg.photoUrl} />
                <div>{msg.content}</div>
              </div>
            ))
        ) : (
          <div></div>
        )}
        <form>
          <label htmlFor="message"></label>
          <input
            type="text"
            id="message"
            onChange={e => this.handleChange(e)}
          ></input>
          <button
            type="button"
            onClick={() =>
              this.props.sendMessage(
                this.props.tripId,
                this.props.userId,
                this.state.messageToBeSent
              )
            }
          >
            Send Message!
          </button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatBoard);
