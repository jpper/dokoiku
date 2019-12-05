import { createStore } from "redux";

const initialState = {
  trips: [
    {
      startDate: "Dec 25",
      endDate: "Dec 31",
      startLocation: {
        name: "Tokyo",
        location: { lat: 35.689722, lng: 139.692222 }
      },
      waypoints: [
        {
          name: "Kyoto",
          location: { lat: 35.011667, lng: 135.768333 },
          stopover: true
        },
        {
          name: "Kanazawa",
          location: { lat: 36.561056, lng: 136.656417 },
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
      startLocation: {
        name: "Tokyo",
        location: { lat: 35.689722, lng: 139.692222 }
      },
      waypoints: [
        {
          name: "Akita",
          location: { lat: 39.720028, lng: 140.102583 },
          stopover: true
        },
        {
          name: "Niigata",
          location: { lat: 37.916111, lng: 139.036389 },
          stopover: true
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
      if (state.currentTrip === 0) {
        nextIndex = state.trips.length - 1;
      } else {
        nextIndex = state.currentTrip - 1;
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
