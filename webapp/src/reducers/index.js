import * as ActionTypes from '../actions';
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { db } from '../index';

// Updates an entity cache in response to any action with response.entities.
const signUp = (state = {}, action) => {
  const {type} = action;

  switch(type) {
  case ActionTypes.CREATE_ACCOUNT_SUCCESS:
    return state;
  default: 
    return state;
  }
}

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
    localStorage.setItem('loggedPerson', action.response.email);
    
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
  let accountId = localStorage.getItem('loggedPerson')
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
  let accountId = localStorage.getItem('loggedPerson')

  switch(type) {
  case ActionTypes.LOGIN_SUCCESS:
    let loadedBooks = JSON.parse(localStorage.getItem(accountId))

    return loadedBooks;
  case ActionTypes.REGISTER_BORROW:
    let arrayWithNewBorrowedBook = [ ...state, borrowedBook(undefined, action)]
    return arrayWithNewBorrowedBook;
  case ActionTypes.UNREGISTER_BORROW: 
    let arrayWithoutBorrowedBook = [ ...state.filter(borrowedBook => borrowedBook.bookAddress !== action.bookAddress) ]

    return arrayWithoutBorrowedBook;
  default: 
    return state;
  }
}

const loading = (state = {
  isLoading: false
}, action) => {
  const { type } = action; 
  const splittedTypeText = type.split('_').reverse()
  const typeOfAction = splittedTypeText[0]

  switch(typeOfAction) {
  case 'REQUEST':
    return {
      ...state,
      isLoading: true
    };
  case 'FAILURE':
  case 'SUCCESS':
    return {
      ...state,
      isLoading: false
    };
  default: 
    return state;
  } 
}

const statistics = (state = {
  library: {},
  publishers: []
}, action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.FETCH_STATISTICS_SUCCESS:
    return {
      library: action.response.library,
      publishers: action.response.publishers
    }
  default: 
    return state;
  }
}

const infoFromBook = (state = {
    name: '',
    soldInstances: 0,
    loans: 0
}, action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.FETCH_INFO_SUCCESS:
    return {
      name: action.response.name,
      soldInstances: action.response.soldInstances,
      loans: action.response.loans
    }
  default:
    return state;
  }
}

const permissions = (state = [], action) => {
  const { type } = action;

  switch(type) {
  case ActionTypes.VIEW_SUCCESS:
    // if (action.hasAccess) {
      return [ ...state, action.response.bookAddress ]
    // }

    // return state;
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
  infoFromBook,
  loading,
  statistics,
  routing
});

const getBorrowedBook = (state, bookAddress) => state.borrowedBooks.filter(borrowedBook => borrowedBook.bookAddress === bookAddress)[0]
const getHasPermission = (state, bookAddress) => state.permissions.indexOf(bookAddress) !== -1;
export { getBorrowedBook, getHasPermission };
export default rootReducer;

