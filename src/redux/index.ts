import { createStore } from "redux";

const initialState = {
  trips: [
    {
      startDate: "Dec 25",
      endDate: "Dec 31",
      locations: [
        {
          name: "Great Wall of China",
          lat: 10,
          lon: 400
        },
        {
          name: "Code Chrysalis",
          lat: 150,
          lon: 150
        }
      ],
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
      locations: [
        {
          name: "Olive Garden",
          lat: 1,
          lon: 1
        }
      ],
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
  currentTrip: 0,
  showProfile: false,
  showChat: false,
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
        trips: [...state.trips],
        currentTrip: nextIndex,
        showProfile: false,
        showChat: false,
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
        trips: [...state.trips],
        currentTrip: nextIndex,
        showProfile: false,
        showChat: false,
        currentProfile: state.currentProfile
      };
    }
    case "SHOW_PROFILE": {
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: true,
        showChat: false,
        currentProfile: action.index
      };
    }
    case "SHOW_CHAT": {
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: true,
        currentProfile: state.currentProfile
      };
    }
    case "CLOSE_POPUP": {
      return {
        trips: [...state.trips],
        currentTrip: state.currentTrip,
        showProfile: false,
        showChat: false,
        currentProfile: state.currentProfile
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
