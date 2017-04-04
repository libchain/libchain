import * as ActionTypes from '../actions';
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

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

const borrowedBook = (state = {
  keypair: null,
  bookAddress: '',
}, action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.REGISTER_BORROW: 
    return {
      keypair: action.keypair,
      bookAddress: action.bookAddress
    }
  default:
    return state;
  }
}

const borrowedBooks = (state = [], action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.REGISTER_BORROW:
    return [ ...state, borrowedBook(undefined, action)];
  case ActionTypes.UNREGISTER_BORROW: 
    return [ ...state.filter(borrowedBook => borrowedBook.bookAddress !== action.bookAddress) ]
  default: 
    return state;
  }
}

const loading = (state = {
  isLoading: false
}, action) => {
  const { type } = action; 

  switch(type) {
  case ActionTypes.FETCH_BOOKS_REQUEST:
    return {
      ...state,
      isLoading: true
    };
  case ActionTypes.FETCH_BOOKS_FAILURE:
  case ActionTypes.FETCH_BOOKS_SUCCESS:
    return {
      ...state,
      isLoading: false
    };
  } 
}

const permissions = (state = [], action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.VIEW_SUCCESS:
    return [ ...state, action.response.bookAddress ]
  default:
    return state;
  }
}
// TODO: lend books should save the public keys into indexed db

const books = (state = [], action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.FETCH_BOOKS_SUCCESS:
    return [
      ...action.response
    ]/*
  case ActionTypes.FETCH_BOOKS_FAILURE:*/
  default:
    return state;

  }
}

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

/**
  * Need of pdf reducer?
  */

const rootReducer = combineReducers({
  login,
  errorMessage,
  borrowedBooks,
  books,
  permissions,
  loading,
  routing
});

const getBorrowedBook = (state, bookAddress) => state.borrowedBooks.filter(borrowedBook => borrowedBook.bookAddress === bookAddress)[0]
const getHasPermission = (state, bookAddress) => state.permissions.indexOf(bookAddress) !== -1;
export { getBorrowedBook, getHasPermission };
export default rootReducer;

