import axios from 'axios';
import { Action as ReduxAction,  } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { setAlert } from './alert';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './constants';
import setAuthToken from '../utils/setAuthToken';
import { AnyAction, Dispatch } from 'redux';

export type Action<T extends string = string, P = void> = P extends void
  ? ReduxAction<T>
  : ReduxAction<T> & Readonly<{ payload: P }>;

  export type State = {};
export type DispatchAction<T = void> = ThunkAction<
  Promise<T>,
  State,
  void,
  Action
>;
export function loadUser() {
  return async (dispatch: any) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      })
    }
  }
}

export function register({ name, email, password }: any) {
  return async (dispatch: any) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('/api/users/', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      dispatch(loadUser());
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: REGISTER_FAIL
      })
    }
  }
}

export function login(email: any, password: any) {
  return async (dispatch: any) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('/api/auth', body, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: LOGIN_FAIL
      })
    }
  }
}

export function logout() {
  return (dispatch: any) => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
  }
}