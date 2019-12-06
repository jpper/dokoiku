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
    var ref = window.firebase.database().ref();
    var hash = window.location.hash.replace(/#/g, '');
    if (hash) {
      ref = ref.child("Notebook1");
    } else {
      ref = ref.push(); // generate unique location.
      window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
    }
    if (typeof console !== 'undefined') {
      console.log('Firebase data: ', ref.toString());
    }
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