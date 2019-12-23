import { createStore } from "redux";

const initialState: any = {
  userId: "",
  userName: "",
  userPhoto: "",
  userCurrencyCode: "",
  currentTripMessages: [],
  messageListener: undefined,
  ongoingTrips: [],
  searchTrips: [],
  pendingTrips: [],
  pastTrips: [],
  currentOngoingTripIndex: 0,
  currentSearchTripIndex: 0,
  currentPastTripIndex: 0,
  users: [],
  showChat: false,
  showEdit: false,
  currentProfile: 0,
  mapTripMessage: 0,
  showPastTrips: false,
  showReviews: false,
  requests: [],
  displayProfile: undefined,
  pageTabIndex: 0
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
    case "NEXT_PAST_TRIP": {
      let nextIndex: number;
      if (state.currentPastTripIndex + 1 >= state.pastTrips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentPastTripIndex + 1;
      }
      return {
        ...state,

        currentPastTripIndex: nextIndex
      };
    }
    case "PREVIOUS_PAST_TRIP": {
      let nextIndex: number;
      if (state.currentPastTripIndex === 0) {
        nextIndex = state.pastTrips.length - 1;
      } else {
        nextIndex = state.currentPastTripIndex - 1;
      }
      return {
        ...state,
        currentPastTripIndex: nextIndex
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
    case "ADD_PAST_TRIP": {
      return {
        ...state,
        pastTrips: [...state.pastTrips, action.pastTrips]
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
    case "CLEAR_PROFILE": {
      return {
        ...state,
        displayProfile: undefined
      };
    }
    //toggle notes and messages for ongoing trip view
    //0 = map, 1 = notes, 2 = msg
    case "TOGGLE_NOTES": {
      if (state.mapTripMessage === 0) {
        return {
          ...state,
          mapTripMessage: 1
        };
      }
      if (state.mapTripMessage === 1) {
        return {
          ...state,
          mapTripMessage: 0
        };
      }
      if (state.mapTripMessage === 2) {
        return {
          ...state,
          mapTripMessage: 1
        };
      }
      break;
    }
    case "TOGGLE_MESSAGES": {
      if (state.mapTripMessage === 0) {
        return {
          ...state,
          mapTripMessage: 2
        };
      }
      if (state.mapTripMessage === 1) {
        return {
          ...state,
          mapTripMessage: 2
        };
      }
      if (state.mapTripMessage === 2) {
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
    case "CHANGE_DISPLAY_PROFILE": {
      return {
        ...state,
        displayProfile: action.displayProfile
      };
    }

    case "REMOVE_REQUEST": {
      const newRequests = state.requests.filter(
        (request: any) =>
          !(
            request.fromId === action.fromId && request.tripId === action.tripId
          )
      );
      return { ...state, requests: newRequests };
    }
    case "SET_PAGE_TAB_INDEX": {
      return {
        ...state,
        pageTabIndex: action.index
      };
    }
    case "SET_USER_CURRENCY_CODE": {
      return {
        ...state,
        userCurrencyCode: action.userCurrencyCode
      };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
