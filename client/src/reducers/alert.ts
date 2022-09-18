import { SET_ALERT, REMOVE_ALERT } from '../actions/constants';

const initialState: Array<any> = []

export default function alert(state: any = initialState, action: any) {
  switch(action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((alert: any) => alert.id !== action.payload);
    default:
      return state;
  }
};