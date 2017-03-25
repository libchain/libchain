import { CALL_API } from '../middleware/api';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
const sendLogin = loginData => ({
  [CALL_API]: {
    types: [ LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE ],
    verb: 'POST',
    endpoint: 'auth/login',
    authentificate: false,
    payload: loginData
  }
});

// Fetches a single user from Github API unless it is cached.
// Relies on Redux Thunk middleware.
export const login = (loginData) => (dispatch) => {
  dispatch(sendLogin(loginData));
  dispatch(generateKeyPair());
  return dispatch(publicKey());
};

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

// Fetches a single user from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
export const logout = () => ({
  type: LOGOUT_SUCCESS
});

export const CREATE_ACCOUNT_REQUEST = 'CREATE_ACCOUNT_REQUEST';
export const CREATE_ACCOUNT_SUCCESS = 'CREATE_ACCOUNT_SUCCESS';
export const CREATE_ACCOUNT_FAILURE = 'CREATE_ACCOUNT_FAILURE';

const sendCreateAccount = accountData => ({
  [CALL_API]: {
    types: [ CREATE_ACCOUNT_REQUEST, CREATE_ACCOUNT_SUCCESS, CREATE_ACCOUNT_FAILURE ],
    verb: 'POST',
    endpoint: 'users',
    authentificate: false,
    payload: accountData
  }
});

export const createAccount = (accountData) => (dispatch) => {
  return dispatch(sendCreateAccount(accountData))
}

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

// Resets the currently visible error message.
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE
});

export const GENERATE_KEY_PAIR = 'GENERATE_KEY_PAIR';

export const generateKeyPair = () => ({
  type: GENERATE_KEY_PAIR
});

export const SEND_KEY_REQUEST = 'SEND_KEY_REQUEST';
export const SEND_KEY_SUCCESS = 'SEND_KEY_SUCCESS';
export const SEND_KEY_FAILURE = 'SEND_KEY_FAILURE';

const sendPublicKey = (publicKey) => ({
  [CALL_API]: {
    types: [ SEND_KEY_REQUEST, SEND_KEY_SUCCESS, SEND_KEY_FAILURE ],
    verb: 'PUT',
    endpoint: '/users/publicKey',
    authentificate: true,
    payload: publicKey
  }
});

export const FETCH_BOOKS_REQUEST = 'FETCH_BOOKS_REQUEST';
export const FETCH_BOOKS_SUCCESS = 'FETCH_BOOKS_SUCCESS';
export const FETCH_BOOKS_FAILURE = 'FETCH_BOOKS_FAILURE';

const fetchBooks = (fromAdmin) => ({
  [CALL_API]: {
    types: [ FETCH_BOOKS_REQUEST, FETCH_BOOKS_SUCCESS, FETCH_BOOKS_FAILURE ],
    verb: 'GET',
    endpoint: 'books/' + (fromAdmin ? 'admin' : '')
  }
});

export const requestBooks = (fromAdmin) => (dispatch) => {
  return dispatch(fetchBooks(fromAdmin));
};
export const BUY_OR_LEND_REQUEST = 'BUY_OR_LEND_REQUEST';
export const BUY_OR_LEND_SUCCESS = 'BUY_OR_LEND_SUCCESS';
export const BUY_OR_LEND_FAILURE = 'BUY_OR_LEND_FAILURE';

const sendBuyOrLendRequest = (bookAddress, publisherAddress) => ({
  [CALL_API]: {
    types: [ BUY_OR_LEND_REQUEST, BUY_OR_LEND_SUCCESS, BUY_OR_LEND_FAILURE ],
    verb: 'POST',
    endpoint: 'users/' + (publisherAddress !== undefined ? 'admin/buy' : 'lend'),
    authentificate: true,
    payload: {
      bookAddress,
      publisherAddress
    }
  }
});

export const buyBook = (bookAddress, publisherAddress) => (dispatch) => {
  return dispatch(sendBuyOrLendRequest(bookAddress, publisherAddress));
};

export const lendBook = (bookAddress) => (dispatch) => {
  return dispatch(sendBuyOrLendRequest(bookAddress));
};

export const publicKey = () => (dispatch, getState) => {
  return dispatch(sendPublicKey({ publicKey: getState().keyPair.publicKey }));
};
