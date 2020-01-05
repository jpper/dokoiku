import firebase from "firebase";

export const config = {
  apiKey: "AIzaSyCetKogvCSTjzUzcPllHYZYHqLFueGZ-js",
  authDomain: "dokoiku-ed6b6.firebaseapp.com",
  databaseURL: "https://dokoiku-ed6b6.firebaseio.com",
  projectId: "dokoiku-ed6b6",
  storageBucket: "dokoiku-ed6b6.appspot.com",
  messagingSenderId: "693650771241",
  appId: "1:693650771241:web:47ea4be3e6d2e42884bb38",
  measurementId: "G-5PYH1HYKPX"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  // timestampsInSnapshots: true
});

export const myFirebase = firebase;
export const myFirestore = firebase.firestore();
export const myStorage = firebase.storage();
