const SET_NOTIFICATION = 'SET_NOTIFICATION';
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

const defaultState = {
  message: '',
  visible: false
}

export default function notificationReducer(state = defaultState, action) {
  switch(action.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        message: action.payload,
        visible: true
    }
    case HIDE_NOTIFICATION:
      return {
        ...state,
        visible: false
      }
    default:
      return state;
  }
}

export const setNotification = message => ({type: SET_NOTIFICATION, payload: message});
export const hideNotification = () => ({type: HIDE_NOTIFICATION});