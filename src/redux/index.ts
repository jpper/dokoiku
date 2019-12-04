import { createStore } from "redux";

//This is a work in progress

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
    case "PRINT": {
      console.log("HOWDY");
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: state.showProfile,
        showChat: state.showChat
      };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
