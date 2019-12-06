import { createStore } from "redux";

const initialState = {
  userId: "",
  userName: "",
  userPhoto: "",
  trips: [
    {
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
      members: [
        {
          username: "followdiallo",
          name: "Diallo Spears",
          propic:
            "http://www.taiwan-america.org/uploads/2/5/5/5/25556575/_1453420708.png"
        },
        {
          username: "nlandon2",
          name: "Nate Landon",
          propic:
            "https://secure.meetupstatic.com/photos/event/8/e/0/9/600_486996361.jpeg"
        }
      ]
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
      members: [
        {
          username: "followdiallo",
          name: "Diallo Spears",
          propic:
            "http://www.taiwan-america.org/uploads/2/5/5/5/25556575/_1453420708.png"
        }
      ]
    }
  ],
  currentTrip: 1,
  showProfile: false,
  showChat: false,
  showBuild: false,
  currentProfile: 0
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
        userId: state.userId,
        userName: state.userName,
        userPhoto: state.userPhoto,
        trips: [...state.trips],
        currentTrip: nextIndex,
        showProfile: false,
        showChat: false,
        showBuild: false,
        currentProfile: state.currentProfile
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
        userId: state.userId,
        userName: state.userName,
        userPhoto: state.userPhoto,
        trips: [...state.trips],
        currentTrip: nextIndex,
        showProfile: false,
        showChat: false,
        showBuild: false,
        currentProfile: state.currentProfile
      };
    }
    case "SHOW_PROFILE": {
      return {
        userId: state.userId,
        userName: state.userName,
        userPhoto: state.userPhoto,
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: true,
        showChat: false,
        showBuild: false,
        currentProfile: action.index
      };
    }
    case "SHOW_CHAT": {
      return {
        userId: state.userId,
        userName: state.userName,
        userPhoto: state.userPhoto,
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: true,
        showBuild: false,
        currentProfile: state.currentProfile
      };
    }
    case "CLOSE_POPUP": {
      return {
        userId: state.userId,
        userName: state.userName,
        userPhoto: state.userPhoto,
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: false,
        showBuild: false,
        currentProfile: state.currentProfile
      };
    }
    case "SHOW_BUILD": {
      //Add some logic to add trip to Firebase
      return {
        userId: state.userId,
        userName: state.userName,
        userPhoto: state.userPhoto,
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: false,
        showBuild: true,
        currentProfile: state.currentProfile
      };
    }
    case "SET_USER_INFO": {
      return {
        userId: action.userId,
        userName: action.userName,
        userPhoto: action.userPhoto,
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: false,
        showBuild: false
      };
    }
    case "ADD_TRIP": {
      return state.trips.concat(action.trip);
    }
    default: {
      return state;
    }
  }
};

export const store = createStore(reducer);
