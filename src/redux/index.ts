import { createStore } from "redux";

const initialState = {
  trips: [],
  currentTrip: 0,
  showProfile: false,
  showChat: false
};

interface Action {
  type: string;
  [key: string]: any;
}

const reducer = (state = initialState, action: Action): any => {
  switch (action.type) {
    case "GET_TRIPS": {
      //Call the DB, get the trips, and change the state
      return; //this is a placeholder, don't actually do this
    }
    case "NEXT_TRIP": {
      let nextIndex: number;
      if (state.currentTrip + 1 >= state.trips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentTrip + 1;
      }
      return {
        trips: [...state.trips],
        currentTrip: nextIndex,
        showProfile: state.showProfile,
        showChat: state.showChat
      };
    }
    case "PREVIOUS_TRIP": {
      let nextIndex: number;
      if (state.currentTrip - 1 < 0) {
        nextIndex = state.trips.length - 1;
      } else {
        nextIndex = state.currentTrip + 1;
      }
      return {
        trips: [...state.trips],
        currentTrip: nextIndex,
        showProfile: state.showProfile,
        showChat: state.showChat
      };
    }
    case "SHOW_PROFILE": {
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: true,
        showChat: false
      };
    }
    case "SHOW_CHAT": {
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: true
      };
    }
    case "CLOSE_POPUP": {
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: false
      };
    }
    case "ADD_TRIP": {
      //Add some logic to add trip to Firebase
      return state;
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
