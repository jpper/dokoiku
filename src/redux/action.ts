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
