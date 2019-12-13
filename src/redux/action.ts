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

export const addRequest = (request: any) => ({
  type: "ADD_REQUEST",
  request
});

export const setShowPastTrips = (status: boolean) => ({
  type: "SET_SHOW_PAST_TRIPS",
  status
});

export const setShowReviews = (status: boolean) => ({
  type: "SET_SHOW_REVIEWS",
  status
});

export const addPendingTrip = (pendingTrip: any) => ({
  type: "ADD_PENDING_TRIP",
  pendingTrip
});

export const removeRequest = (tripId: string, fromId: string) => ({
  type: "REMOVE_REQUEST",
  tripId,
  fromId
});

export const addPastTrip = (pastTrip: any) => ({
  type: "ADD_PAST_TRIP",
  pastTrip
});

export const setPageTabIndex = (index: number) => ({
  type: "SET_PAGE_TAB_INDEX",
  index
});
