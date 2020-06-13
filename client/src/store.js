import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-tunk';
import rootReducer from './reducers';

const intialState = {};

const middleware = [thunk];

const store = createStore(rootReducer, intialState, composeWithDevToolsi(applyMiddleware(...middleware)));