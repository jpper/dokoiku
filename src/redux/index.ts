import { createStore } from "redux";

const initialState: any = {
  userId: "",
  userName: "",
  userPhoto: "",
  currentTripMemberInfo: [],
  currentTripMessages: [],
  trips: [
    {
      tripId: "5kzUrGkzztrKyoc6tBBA",
      tripMemberIds: [],
      startDate: "Dec 25",
      endDate: "Dec 31",
      startLocation: "Tokyo, Japan",
      waypoints: [
        {
          location: "Kyoto, Japan",
          stopover: true
        },
        {
          location: "Kanazawa, Japan",
          stopover: true
        }
      ],
      travelMode: "DRIVING",
      budget: 1000,
      memberIds: []
    },
    {
      startDate: "Jan 1",
      endDate: "Dec 31",
      startLocation: "Tokyo, Japan",
      waypoints: [
        {
          location: "Akita, Japan",
          stopover: true
        },
        {
          location: "Niigata, Japan",
          stopover: true
        }
      ],
      travelMode: "DRIVING",
      budget: 25,
      memberIds: []
    }
  ],
  currentTrip: 0,
  showProfile: false,
  showChat: false,
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
    case "NEXT_TRIP": {
      let nextIndex: number;
      if (state.currentTrip + 1 >= state.trips.length) {
        nextIndex = 0;
      } else {
        nextIndex = state.currentTrip + 1;
      }
      return {
        ...state,
        currentTrip: nextIndex
      };
    }
    case "PREVIOUS_TRIP": {
      let nextIndex: number;
      if (state.currentTrip === 0) {
        nextIndex = state.trips.length - 1;
      } else {
        nextIndex = state.currentTrip - 1;
      }
      return {
        ...state,
        currentTrip: nextIndex
      };
    }
    case "SHOW_PROFILE": {
      return {
        ...state,
        showProfile: true,
        showChat: false,
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
        showProfile: false,
        showChat: false
      };
    }
    case "ADD_TRIP": {
      //Add some logic to add trip to Firebase
      return state;
    }
    case "SET_USER_INFO": {
      return {
        ...state,
        userId: action.userId,
        userName: action.userName,
        userPhoto: action.userPhoto
      };
    }
    case "SET_MESSAGES": {
      // console.log(action.messages);
      return {
        ...state,
        currentTripMessages: [...state.currentTripMessages, action.messages]
      };
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
