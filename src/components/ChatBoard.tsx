import moment from "moment";
import uuidv4 from "uuid/v4";
import firebase, { firestore } from "firebase";
import React, { Component } from "react";
// import ReactLoading from "react-loading";
import { myFirebase, myFirestore } from "../config/firebase";

interface Status {
  tripId: string;
  currentUserId: string;
  // currentUserAvatar: string;
  currentUserDisplayName: string;
  currentPeerUserIds: string[];
  groupChatId: string;
  listMessage: firebase.firestore.DocumentData[];
  messageListener: Function | null;
  groupMemberListener: Function | null;
  groupMemberInfo: any;
  message: string;
}

export default class ChatBoard extends Component<{}, Status> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tripId: "5kzUrGkzztrKyoc6tBBA",
      currentUserId: "N2WU4k5ui7QTexKJNP5kNvkELOK2",
      // currentUserAvatar: "",
      currentUserDisplayName: "Ziyu Chen",
      currentPeerUserIds: [],
      groupChatId: "",
      listMessage: [],
      messageListener: null,
      groupMemberListener: null,
      groupMemberInfo: [],
      message: ""
    };
  }
  async componentDidMount() {
    // Get memberIds
    await this.getGroupMembers();
    //await this.getGroupMemberInfo(this.state.currentUserId);
    // console.log(this.state.currentPeerUserIds);
    // await this.state.currentPeerUserIds.forEach(id => {
    //   this.getGroupMemberInfo(id);
    //   console.log("GET GROUP MEM INFO: ", id);
    // });
    await this.getListHistory();
    // this.addNameToMsg();
  }
  getListHistory = () => {
    const messageListener = myFirestore
      .collection("trips")
      .doc(this.state.tripId)
      .collection("messages")
      .onSnapshot(
        snapShot => {
          snapShot.docChanges().forEach(change => {
            if (change.type === "added") {
              this.setState({
                listMessage: [...this.state.listMessage, change.doc.data()]
              });
            }
          });
        },
        err => {
          console.log(err.toString());
        }
      );
    this.setState({
      messageListener
    });

    // // TODO:
    // this.addNameToMsg();
  };
  getGroupMembers = () => {
    const groupMemberListener = myFirestore
      .collection("trips")
      .doc(this.state.tripId)
      .onSnapshot(snapShot => {
        console.log(snapShot.data());
        this.setState({
          currentPeerUserIds: snapShot.data().memberIds
        });
        console.log("GET GROUP MEMEBERS!");
        console.log(this.state.currentPeerUserIds);

        this.state.currentPeerUserIds.forEach(id => {
          this.getGroupMemberInfo(id);
          console.log("GET GROUP MEM INFO: ", id);
        });
      });
  };
  sendMessage = () => {
    const content = this.state.message;
    const moment = firestore.FieldValue.serverTimestamp();

    const message = {
      content,
      fromId: this.state.currentUserId,
      moment
    };
    myFirestore
      .collection("trips")
      .doc(this.state.tripId)
      .collection("messages")
      .doc(uuidv4())
      .set(message)
      .then(() => {
        console.log("successful!");
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      message: e.currentTarget.value
    });
  }
  getGroupMemberInfo(id: string) {
    myFirestore
      .collection("users")
      .where("id", "==", id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching user");
          return;
        }
        const tmpInfo: any[] = [];
        snapshot.forEach((doc: any) => {
          tmpInfo.push(doc.data());
        });
        console.log(tmpInfo);
        this.setState({
          groupMemberInfo: tmpInfo
        });
      })
      .then(() => {
        console.log("GET GROUP MEM INFO!!!!");
        console.log(this.state.groupMemberInfo);
      })
      .catch(err => {
        console.log(err);
      });
  }
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
    console.log(this.state.listMessage);
    return (
      <div className="ChatBoard">
        {this.state.listMessage.length ? (
          this.state.listMessage.map(msg => (
            <div>
              <div>
                {
                  this.state.groupMemberInfo.filter((info: any) => {
                    console.log(info);
                    return info.id === msg.fromId;
                  })[0].nickname
                }
              </div>
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
          <button type="button" onClick={this.sendMessage}>
            Send Message!
          </button>
        </form>
      </div>
    );
  }
}
