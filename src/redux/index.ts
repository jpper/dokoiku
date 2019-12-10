import { createStore } from "redux";

const initialState: any = {
  userId: "",
  userName: "",
  userPhoto: "",
  currentTripMessages: [],
  messageListener: undefined,
  ongoingTrips: [],
  searchTrips: [],
  currentOngoingTripIndex: 0,
  currentSearchTripIndex: 0,
  showProfile: false,
  showChat: false,
  showBuild: false,
  currentProfile: 0
};

interface Action {
  type: string;
  [key: string]: any;
}

const reducer = (state: any = initialState, action: Action): any => {
  switch (action.type) {
    case "GET_TRIPS": {
      //Call the DB, get the trips, and change the state
      return; //this is a placeholder, don't actually do this
    }
    case "NEXT_SEARCH_TRIP": {
      let nextIndex: number;
      if (state.currentSearchTripIndex + 1 >= state.searchTrips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentSearchTripIndex + 1;
      }
      return {
        ...state,
        showProfile: false,
        currentSearchTripIndex: nextIndex
      };
    }
    case "PREVIOUS_SEARCH_TRIP": {
      let nextIndex: number;
      if (state.currentSearchTripIndex === 0) {
        nextIndex = state.searchTrips.length - 1;
      } else {
        nextIndex = state.currentSearchTripIndex - 1;
      }
      return {
        ...state,
        showProfile: false,
        currentSearchTripIndex: nextIndex
      };
    }
    case "NEXT_ONGOING_TRIP": {
      let nextIndex: number;
      if (state.currentOngoingTripIndex + 1 >= state.ongoingTrips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentOngoingTripIndex + 1;
      }
      return {
        ...state,
        showProfile: false,
        currentOngoingTripIndex: nextIndex
      };
    }
    case "PREVIOUS_ONGOING_TRIP": {
      let nextIndex: number;
      if (state.currentOngoingTripIndex === 0) {
        nextIndex = state.ongoingTrips.length - 1;
      } else {
        nextIndex = state.currentOngoingTripIndex - 1;
      }
      return {
        ...state,
        showProfile: false,
        currentOngoingTripIndex: nextIndex
      };
    }
    case "SHOW_PROFILE": {
      return {
        ...state,
        showProfile: true,
        showChat: false,
        showBuild: false,
        currentProfile: action.index
      };
    }
    case "SHOW_CHAT": {
      return {
        ...state,
        showProfile: false,
        showChat: true
      };
    }
    case "CLOSE_POPUP": {
      return {
        ...state,
        showBuild: false,
        showProfile: false
      };
    }
    case "SHOW_BUILD": {
      //Add some logic to add trip to Firebase
      return {
        ...state,
        showBuild: true
      };
    }
    case "SET_USER_INFO": {
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
        userPhoto: action.userPhoto,
        showProfile: false,
        showChat: false,
        showBuild: false
      };
    }
    case "ADD_SEARCH_TRIP": {
      return {
        ...state,
        searchTrips: [...state.searchTrips, action.searchTrip]
      };
    }
    case "ADD_ONGOING_TRIP": {
      return {
        ...state,
        ongoingTrips: [...state.ongoingTrips, action.ongoingTrip]
      };
    }
    case "SET_MESSAGES": {
      // console.log(action.messages);
      const tmpMessages = [...state.currentTripMessages, action.messages].sort(
        (a: any, b: any) => a.moment.seconds - b.moment.seconds
      );
      // console.log("TESTTSTSYSYUSI");
      // console.log(tmpMessages);
      return {
        ...state,
        currentTripMessages: tmpMessages
      };
    }
    case "CLEAR_MESSAGES": {
      return {
        ...state,
        currentTripMessages: []
      };
    }
    case "SET_MESSAGE_LISTENER": {
      return {
        ...state,
        messageListener: action.listener
      };
    }
    case "JOIN_TRIP": {
      return {
        ...state
      };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
