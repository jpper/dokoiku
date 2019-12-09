import { createStore } from "redux";

const initialState: any = {
  userId: "",
  userName: "",
  userPhoto: "",
  currentTripMessages: [],
  messageListener: undefined,
  trips: [],
  currentTripIndex: 0,
  showProfile: false,
  showChat: false,
  showBuild: false,
  currentProfile: 0,
  ongoingTripToggle: 0
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
    case "NEXT_TRIP": {
      let nextIndex: number;
      if (state.currentTripIndex + 1 >= state.trips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentTripIndex + 1;
      }
      return {
        ...state,
        showProfile: false,
        currentTripIndex: nextIndex
      };
    }
    case "PREVIOUS_TRIP": {
      let nextIndex: number;
      if (state.currentTripIndex === 0) {
        nextIndex = state.trips.length - 1;
      } else {
        nextIndex = state.currentTripIndex - 1;
      }
      return {
        ...state,
        showProfile: false,
        currentTripIndex: nextIndex
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
        trips: [...state.trips],
        currentTripIndex: state.currentTripIndex,
        showProfile: false,
        showChat: false,
        showBuild: false
      };
    }
    case "ADD_TRIP": {
      return {
        ...state,
        trips: [...state.trips, action.trip]
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
    case "SET_TRIPS": {
      return {
        ...state,
        trips: action.trips
      };
    }
    case "JOIN_TRIP": {
      return {
        ...state
      };
    }
    //toggle notes and messages for ongoing trip view
    //0 = map, 1 = notes, 2 = msg
    case "TOGGLE_NOTES": {
      if (action.value === 0) {
      return {
        ...state,
        ongoingTripToggle: 1
      };
    }
      return {
        ...state,
        ongoingTripToggle: 0
      };
    }
    case "TOGGLE_MESSAGES": {
      if (action.value === 0) {
        return {
          ...state,
          ongoingTripToggle: 2
        };
      }
        return {
          ...state,
          ongoingTripToggle: 0
        };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
