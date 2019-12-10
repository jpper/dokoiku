import React, { Component } from "react";
import "../styles/Notes.css";
import { config, myFirebase } from "../config/firebase";

class Editor extends Component {
  componentDidMount() {
    //// Initialize Firebase.
    // window.firebase.initializeApp(config);
    //// Get Firebase Database reference.
    const firepadRef = this.getExampleRef();
    //// Create CodeMirror (with lineWrapping on).
    const codeMirror = window.CodeMirror(
      document.getElementById("firepad-container"),
      { lineWrapping: true }
    );
    //// Create Firepad (with rich text toolbar and shortcuts enabled).
    const firepad = window.Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextToolbar: true,
      richTextShortcuts: true
    });
    //// Initialize contents.
    firepad.on("ready", function() {
      if (firepad.isHistoryEmpty()) {
        firepad.setHtml(
          '<span style="font-size: 24px;">Rich-text editing with <span style="color: red">DokoIku Notes!</span></span><br/><br/>Collaborative-editing made easy.\n'
        );
      }
    });
  }

  componentDidUpdate() {
    const firepadRef = this.getExampleRef();
    //// Create CodeMirror (with lineWrapping on).
    const codeMirror = window.CodeMirror(
      document.getElementById("firepad-container"),
      { lineWrapping: true }
    );
    //// Create Firepad (with rich text toolbar and shortcuts enabled).
    const firepad = window.Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextToolbar: true,
      richTextShortcuts: true
    });
    //// Initialize contents.
    firepad.on("ready", function() {
      if (firepad.isHistoryEmpty()) {
        firepad.setHtml(
          '<span style="font-size: 24px;">Rich-text editing with <span style="color: red">DokoIku Notes!</span></span><br/><br/>Collaborative-editing made easy.\n'
        );
      }
    });
  }

  // Helper to get hash from end of URL or generate a random one.
  getExampleRef() {
    let ref = myFirebase.database().ref();
    ref = ref.child(this.props.tripId);

    // set an asynchronous listener to retrieve realtime data
    ref.on(
      "value",
      function(snapshot) {
        console.log(snapshot.val());
      },
      function(errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
    return ref;
  }

  render() {
    return (
      <>
        <div id="firepad-container"></div>
      </>
    );
  }
}
export default Editor;
