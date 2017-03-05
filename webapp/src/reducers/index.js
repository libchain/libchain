import * as ActionTypes from '../actions';
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { generateRSAKey, publicKeyString } from 'cryptico'
// Updates an entity cache in response to any action with response.entities.
const login = (state = {
  jwt: null,
  isLoading: false
}, action) => {
  if (action.type === ActionTypes.LOGOUT_SUCCESS) {
    localStorage.removeItem('loginToken');
    return {
      ...state,
      jwt: null
    };
  }

  let jwt;
  switch (action.type) {
  case ActionTypes.LOGIN_SUCCESS:
    jwt = action.response.token;
    localStorage.setItem('loginToken', jwt);

    return {
      jwt,
      isLoading: false
    };
  case ActionTypes.LOGIN_FAILURE:
    return {
      ...state,
      isLoading: false
    }
  case ActionTypes.LOGIN_REQUEST:
    return {
      ...state,
      isLoading: true
    }
  default:
    return state;
  }
};

const keyPair = (state = {
  publicKey: '',
  privateKey: null
}, action) => {
  const { type } = action;

  if (type === ActionTypes.GENERATE_KEY_PAIR) {
    let privateKey = generateRSAKey(localStorage.getItem('loginToken').slice(0,30), 1024)
    
    return {
      publicKey: publicKeyString(privateKey),
      privateKey
    }
  }

  return state;
};

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return error
  }

  return state
}


const rootReducer = combineReducers({
  login,
  errorMessage,
  keyPair,
  routing
});

export default rootReducer;

