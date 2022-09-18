import axios from 'axios';

import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from './actionTypes';

// Get posts
export function getPosts() {
  return async (dispatch: any) => {
    try {
      const res = await axios.get('/api/posts');

      dispatch({
        type: GET_POSTS,
        payload: res.data
      });
    } catch (err: any) {
      console.log(err);
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Add like
export function addLike(id: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.put(`/api/posts/like/${id}`);

      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Remove like
export function removeLike(id: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.put(`/api/posts/unlike/${id}`);

      dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data }
      });
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Delete post
export function deletePost(id: string) {
  return async (dispatch: any) => {
    try {
      await axios.delete(`/api/posts/${id}`);

      dispatch({
        type: DELETE_POST,
        payload: id
      });

      dispatch(setAlert('Post Removed', 'success'));
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Add post
export function addPost(formData: any) {
  return async (dispatch: any) => {
    try {
      const res = await axios.post('/api/posts', formData);

      dispatch({
        type: ADD_POST,
        payload: res.data
      });

      dispatch(setAlert('Post Created', 'success'));
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Get post
export function getPost(id: string) {
  return async (dispatch: any) => {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      dispatch({
        type: GET_POST,
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Add comment
export function addComment(postId: string, formData: any) {
  return async (dispatch: any) => {
    try {

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      });

      dispatch(setAlert('Comment Added', 'success'));
    } catch (err: any) {
      console.log(err);
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

// Delete comment
export function deleteComment(postId: any, commentId: any) {
  return async (dispatch: any) => {
    try {
      await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

      dispatch({
        type: REMOVE_COMMENT,
        payload: commentId
      });

      dispatch(setAlert('Comment Removed', 'success'));
    } catch (err: any) {
      dispatch({
        type: POST_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
}