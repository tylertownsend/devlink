import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
  ActionType
} from '../actions/actionTypes';
import { ApplicationPostState, CommentState, PostState } from '../state/applicationState';

const initialState: ApplicationPostState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

function postReducer(state: ApplicationPostState = initialState, action: ActionType) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post: PostState) => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post: PostState) =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      const post = state.post as PostState;
      return {
        ...state,
        post: {
          ...state.post,
          comments: post.comments.filter(
            (comment: CommentState) => comment._id !== payload
          )
        },
        loading: false
      };
    default:
      return state;
  }
}

export default postReducer;