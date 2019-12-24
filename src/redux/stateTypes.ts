export interface User {
  aboutMe: string;
  currencyCode: string;
  facebook: string;
  id: string;
  nickname: string;
  photoUrl: string;
  instagram: string;
  twitter: string;
}

type waypoint = {
  location: string;
  stopover: boolean;
};

export interface Trip {
  name: string;
  countryCode: string;
  currencyCode: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  startLocation: string;
  waypoints: waypoint[];
  budget: number;
  memberIds: string[];
  ownerId: string;
  travelMode: string;
  tripId: string;
}
