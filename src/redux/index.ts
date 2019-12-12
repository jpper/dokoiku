import { createStore } from "redux";

const initialState: any = {
  userId: "",
  userName: "",
  userPhoto: "",
  currentTripMessages: [],
  messageListener: undefined,
  ongoingTrips: [],
  searchTrips: [],
  pendingTrips: [],
  currentOngoingTripIndex: 0,
  currentSearchTripIndex: 0,
  users: [],
  showChat: false,
  showEdit: false,
  currentProfile: 0,
  mapTripMessage: 0,
  showPastTrips: false,
  showReviews: false,
  requests: []
};

interface Action {
  type: string;
  [key: string]: any;
}

const reducer = (state: any = initialState, action: Action): any => {
  switch (action.type) {
    case "NEXT_SEARCH_TRIP": {
      let nextIndex: number;
      if (state.currentSearchTripIndex + 1 >= state.searchTrips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentSearchTripIndex + 1;
      }
      return {
        ...state,

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
        currentOngoingTripIndex: nextIndex
      };
    }

    case "SHOW_CHAT": {
      return {
        ...state,
        showChat: true
      };
    }
    case "CLOSE_POPUP": {
      return {
        ...state,
        showEdit: false
      };
    }
    case "SHOW_EDIT": {
      return {
        ...state,
        showEdit: true
      };
    }
    case "SET_USER_INFO": {
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
        userPhoto: action.userPhoto,

        showChat: false
      };
    }
    case "ADD_SEARCH_TRIP": {
      console.log(state.searchTrip);
      console.log(action.searchTrip);
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
    case "ADD_PENDING_TRIP": {
      return {
        ...state,
        pendingTrips: [...state.pendingTrips, action.pendingTrip]
      };
    }
    case "SET_MESSAGES": {
      const tmpMessages = [...state.currentTripMessages, action.messages].sort(
        (a: any, b: any) => a.moment.seconds - b.moment.seconds
      );
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

    case "GET_USERS": {
      return {
        ...state,
        users: action.users
      };
    }
    //toggle notes and messages for ongoing trip view
    //0 = map, 1 = notes, 2 = msg
    case "TOGGLE_NOTES": {
      if (state.mapTripMessage === 0) {
        console.log("Toggle notes 0");
        console.log("STATE: ", state.mapTripMessage);
        return {
          ...state,
          mapTripMessage: 1
        };
      }
      if (state.mapTripMessage === 1) {
        console.log("Toggle notes 1");
        console.log("STATE: ", state.mapTripMessage);
        return {
          ...state,
          mapTripMessage: 0
        };
      }
      if (state.mapTripMessage === 2) {
        console.log("Toggle notes 2");
        console.log("STATE: ", state.mapTripMessage);
        return {
          ...state,
          mapTripMessage: 1
        };
      }
      break;
    }
    case "TOGGLE_MESSAGES": {
      if (state.mapTripMessage === 0) {
        console.log("Toggle messeges: 1");
        console.log("STATE: ", state.mapTripMessage);
        return {
          ...state,
          mapTripMessage: 2
        };
      }
      if (state.mapTripMessage === 1) {
        console.log("Toggle messeges: 1");
        console.log("STATE: ", state.mapTripMessage);
        return {
          ...state,
          mapTripMessage: 2
        };
      }
      if (state.mapTripMessage === 2) {
        console.log("Toggle messeges: 1");
        console.log("STATE: ", state.mapTripMessage);
        return {
          ...state,
          mapTripMessage: 0
        };
      }
      break;
    }
    case "RESET_TOGGLE_MESSAGES": {
      return {
        ...state,
        mapTripMessage: 0
      };
    }

    case "SET_SHOW_PAST_TRIPS": {
      return {
        ...state,
        showPastTrips: action.status,
        showReviews: false
      };
    }

    case "SET_SHOW_REVIEWS": {
      return {
        ...state,
        showPastTrips: false,
        showReviews: action.status
      };
    }

    case "ADD_REQUEST": {
      return {
        ...state,
        requests: [...state.requests, action.request]
      };
    }
    case "LOGOUT": {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
