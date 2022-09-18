import { SET_ALERT, REMOVE_ALERT, ActionType } from '../actions/actionTypes';
import { AlertState } from '../state/applicationState';

const initialState: Array<AlertState> = []

export default function alert(state: Array<AlertState> = initialState, action: ActionType) {
  switch(action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((alert: any) => alert.id !== action.payload);
    default:
      return state;
  }
};