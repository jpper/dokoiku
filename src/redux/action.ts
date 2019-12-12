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

export const toggleNotes = (value: number) => ({
  type: "TOGGLE_NOTES",
  value
});

export const toggleMessages = (value: number) => ({
  type: "TOGGLE_MESSAGES",
  value
});

export const setMessageListener = (listener: any) => ({
  type: "SET_MESSAGE_LISTENER",
  listener
});

export const setTrips = (trips: any) => ({
  type: "SET_TRIPS",
  trips
});

export const setShowPastTrips = (status: boolean) => ({
  type: "SET_SHOW_PAST_TRIPS",
  status
});

export const setShowReviews = (status: boolean) => ({
  type: "SET_SHOW_REVIEWS",
  status
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
