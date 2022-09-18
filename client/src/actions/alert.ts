import { v4 as uuid } from 'uuid';

import {SET_ALERT, REMOVE_ALERT} from './constants';

export function setAlert(msg: any, alertType: any, timeout: number = 5000) {
  return (dispatch: any) => {
    const id = uuid();
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  }
}