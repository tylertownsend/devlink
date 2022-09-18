import axios from 'axios';
import {setAlert} from './alert';

import {
  GET_PROFILES,
  GET_PROFILE,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  ACCOUNT_DELETED,
  PROFILE_ERROR,
  GET_REPOS,
  NO_REPOS
} from './actionTypes';

export type ProfileFormData = {
  company: string;
  website: string;
  location: string;
  status: string;
  skills: string;
  githubUsername: string;
  bio: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  youtube: string;
  instagram: string;
}

export type ExperienceFormData = {
  company: string;
  title: string;
  location: string;
  from: string;
  to: string;
  current: boolean;
  description: string;
}

export type EducationFormData = {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: string;
  to: string;
  current: boolean;
  description: string;
}

export function getCurrentProfile() {
  return async (dispatch: any) => {
    try {
      const res = await axios.get('/api/profile/me');
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    } catch (err: any) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

// Get all profiles
export function getProfiles() {
  return async (dispatch: any) => {
    dispatch({ type: CLEAR_PROFILE });

    try {
      const res = await axios.get('/api/profile');

      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Get profile by ID
export function getProfileById(userId: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err: any) {
      console.log('here', err);
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
}

// Get Github repos
export function getGithubRepos(username: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);

      dispatch({
        type: GET_REPOS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: NO_REPOS
      });
    }
  }
}

/**
 * 
 * @param formData 
 * @param history This is react history object.
 * @param edit 
 * @returns 
 */
export function createProfile(formData: ProfileFormData, history: any, edit = false) {
  return async function(dispatch: any) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const res = await axios.post('/api/profile', formData, config);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })

      dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

      if (!edit) {
        history.push('/dashboard');
      }

    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      })
    }
  }
}

// Add Experience
export function addExperience(formData: any, history: any) {
  return async (dispatch: any) => {
    try {
      const res = await axios.put('/api/profile/experience', formData);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });
      dispatch(setAlert('Experience Added', 'success'));
      history.push('/dashboard');
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Add Education
export function addEducation(formData: any, history: any) {
  return async (dispatch: any) => {
    try {
      const res = await axios.put('/api/profile/education', formData);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Education Added', 'success'));

      history.push('/dashboard');
    } catch (err: any) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error: any) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Delete experience
export function deleteExperience(id: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.delete(`/api/profile/experience/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Experience Removed', 'success'));
    } catch (err: any) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Delete education
export function deleteEducation(id: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.delete(`/api/profile/education/${id}`);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data
      });

      dispatch(setAlert('Education Removed', 'success'));
    } catch (err: any) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Delete account & profile
export function deleteAccount() {
  return async (dispatch: any) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await axios.delete('/profile');

        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETED });

        dispatch(setAlert('Your account has been permanently deleted', ACCOUNT_DELETED));
      } catch (err: any) {
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
      }
    }
  }
}