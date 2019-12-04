import { combineReducers, createStore } from "redux";

//This is a work in progress

const initialState = {
  trips: [],
  currentTrip: 0,
  showProfile: false,
  showChat: false
};

type Action = {
  type: string;
};

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
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

export const rootReducer = combineReducers({});
