export const setUserInfo = (
  userName: string,
  userId: string,
  userPhoto: string
) => ({
  type: "SET_USER_INFO",
  userName,
  userId,
  userPhoto
});

export const setMessages = (messages: any) => ({
  type: "SET_MESSAGES",
  messages
});

export const clearMessages = () => ({
  type: "CLEAR_MESSAGES"
});

export const setMessageListener = (listener: any) => ({
  type: "SET_MESSAGE_LISTENER",
  listener
});

export const setTrips = (trips: any) => ({
  type: "SET_TRIPS",
  trips
});

export const postTrip = (
  startDate: Date,
  endDate: Date,
  startLocation: string,
  waypoints: any,
  budget: number,
  memberIds: any
) => ({
  type: "POST_TRIP",
  startDate,
  endDate,
  startLocation,
  waypoints,
  budget,
  memberIds
});
