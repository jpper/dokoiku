export type User = {
  aboutMe: string;
  currencyCode: string;
  facebook: string;
  id: string;
  nickname: string;
  photoUrl: string;
  instagram: string;
  twitter: string;
};

export type Waypoint = {
  location: string;
  stopover: boolean;
};

export type Trip = {
  name: string;
  countryCode: string;
  currencyCode: string;
  startDate: firebase.firestore.Timestamp;
  endDate: firebase.firestore.Timestamp;
  startLocation: string;
  waypoints: Waypoint[];
  budget: number;
  memberIds: string[];
  ownerId: string;
  travelMode: string;
  tripId: string;
};
