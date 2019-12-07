import React, { Component } from "react";
import './Notes.css'; 

class Editor extends Component {

  componentDidMount() {
    //// Initialize Firebase.
    //// TODO: replace with your Firebase project configuration.
    const config = {
      apiKey: "AIzaSyCZbg4f734eA-lJOnv4r7zGg2ng234dM10",
      authDomain: "project-gopherdor.firebaseapp.com",
      databaseURL: "https://project-gopherdor.firebaseio.com",
      projectId: "project-gopherdor",
      storageBucket: "project-gopherdor.appspot.com",
      messagingSenderId: "290881588885"
    };
    window.firebase.initializeApp(config);
    //// Get Firebase Database reference.
    var firepadRef = this.getExampleRef();
    //// Create CodeMirror (with lineWrapping on).
    var codeMirror = window.CodeMirror(document.getElementById('firepad-container'), { lineWrapping: true });
    //// Create Firepad (with rich text toolbar and shortcuts enabled).
    var firepad = window.Firepad.fromCodeMirror(firepadRef, codeMirror,
        { richTextToolbar: true, richTextShortcuts: true });
    //// Initialize contents.
    firepad.on('ready', function() {
      if (firepad.isHistoryEmpty()) {
        firepad.setHtml('<span style="font-size: 24px;">Rich-text editing with <span style="color: red">Firepad!</span></span><br/><br/>Collaborative-editing made easy.\n');
      }
    });
  }

  // Helper to get hash from end of URL or generate a random one.
  getExampleRef() {
    var ref = window.firebase.database().ref()
    ref = ref.child(this.props.tripId);

    // set an asynchronous listener to retrieve realtime data
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      // ref = ref.child(this.props.tripId);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    return ref;
  }

  render() {
    return (
        <div>
            <div id="firepad-container"></div>
        </div>
        
    );
  }
}
export default Editor;