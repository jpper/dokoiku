import React, { Component } from "react";
import "../styles/Notes.css";
import { myFirebase } from "../config/firebase";

class Notes extends Component<any, any> {
  componentDidMount() {
    const windowMod: any = window;

    //// Get Firebase Database reference.
    const firepadRef = this.getExampleRef();
    //// Create CodeMirror (with lineWrapping on).
    const codeMirror = windowMod.CodeMirror(
      document.getElementById("firepad-container"),
      { lineWrapping: true }
    );
    //// Create Firepad (with rich text toolbar and shortcuts enabled).
    const firepad = windowMod.Firepad.fromCodeMirror(firepadRef, codeMirror, {
      richTextToolbar: true,
      richTextShortcuts: true
    });
    //// Initialize contents.
    firepad.on("ready", function() {
      if (firepad.isHistoryEmpty()) {
        firepad.setHtml(
          "This your group's collaborative document, with real-time editing.\nHappy planning!"
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
      function(snapshot) {},
      function(errorObject: any) {}
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
export default Notes;
