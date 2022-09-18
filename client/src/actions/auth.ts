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
} from './actionTypes';
import setAuthToken from '../utils/setAuthToken';

export type AuthFormData = {
  name: string;
  email: string;
  password: string;
  password2: string;
}

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

export function register({ name, email, password }: AuthFormData) {
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

export function login(email: string, password: string) {
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