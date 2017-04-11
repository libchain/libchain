import { CALL_API } from '../middleware/api';
import cryptico from 'cryptico';
import { JSEncrypt } from 'jsencrypt';
import NodeRSA from 'node-rsa';
import { getBorrowedBook } from '../reducers';

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
  return dispatch(sendLogin(loginData));
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
export const BUY_REQUEST = 'BUY_REQUEST';
export const BUY_SUCCESS = 'BUY_SUCCESS';
export const BUY_FAILURE = 'BUY_FAILURE';

const sendBuyRequest = (bookAddress, publisherAddress) => ({
  [CALL_API]: {
    types: [ BUY_REQUEST, BUY_SUCCESS, BUY_FAILURE ],
    verb: 'POST',
    endpoint: 'users/admin/buy',
    authentificate: true,
    payload: {
      bookAddress,
      publisherAddress
    }
  }
});
export const BORROW_REQUEST = 'BORROW_REQUEST';
export const BORROW_SUCCESS = 'BORROW_SUCCESS';
export const BORROW_FAILURE = 'BORROW_FAILURE';

const sendBorrowRequest = (bookAddress, publicKey) => ({
  [CALL_API]: {
    types: [ BORROW_REQUEST, BORROW_SUCCESS, BORROW_FAILURE ],
    verb: 'POST',
    endpoint: 'users/lend',
    authentificate: true,
    payload: {
      bookAddress,
      publicKey
    }
  }
});

export const buyBook = (bookAddress, publisherAddress) => (dispatch) => {
  return dispatch(sendBuyRequest(bookAddress, publisherAddress));
};

export const REGISTER_BORROW = 'REGISTER_BORROW';

const registerBorrow = (bookAddress, keypair) => ({
  type: REGISTER_BORROW,
  bookAddress,
  keypair
})

export const UNREGISTER_BORROW = 'UNREGISTER_BORROW';



export const borrowBook = (bookAddress) => (dispatch) => {
  let bookKeypair = new NodeRSA({ b: 512 })

  bookKeypair.setOptions({
    environment: 'browser',
    encryptionScheme: 'pkcs1'
  })


  dispatch(sendBorrowRequest(bookAddress, bookKeypair.exportKey('pkcs8-public-pem')));

  return dispatch(registerBorrow(bookAddress, bookKeypair));
};

const unregisterBorrow = (bookAddress) => ({
  type: UNREGISTER_BORROW,
  bookAddress
})
export const RETURN_REQUEST = 'RETURN_REQUEST'; 
export const RETURN_SUCCESS = 'RETURN_SUCCESS'; 
export const RETURN_FAILURE = 'RETURN_FAILURE';

const sendReturnRequest = (bookAddress, publicKey) => ({
  [CALL_API]: {
    types: [ RETURN_REQUEST, RETURN_SUCCESS, RETURN_FAILURE ],
    verb: 'POST',
    endpoint: 'users/return',
    authentificate: true,
    payload: {
      bookAddress,
      publicKey
    }
  }
});

export const returnBook = (bookAddress) => (dispatch, getState) => {
  let bookKeypair = getBorrowedBook(getState(), bookAddress).keypair;

  dispatch(sendReturnRequest(bookAddress, bookKeypair.exportKey('pkcs8-public-pem')));

  return dispatch(unregisterBorrow(bookAddress));
};
export const VIEW_REQUEST = 'VIEW_REQUEST';
export const VIEW_SUCCESS = 'VIEW_SUCCESS';
export const VIEW_FAILURE = 'VIEW_FAILURE';

const sendViewRequest = (encryptedMessage, publicKey) => ({
  [CALL_API]: {
    types: [ VIEW_REQUEST, VIEW_SUCCESS, VIEW_FAILURE ],
    verb: 'POST',
    endpoint: 'users/view',
    authentificate: true,
    payload: {
      encryptedMessage,
      publicKey
    }
  }
})

export const requestView = (bookAddress) => (dispatch, getState) => {
  let bookKeypair = getBorrowedBook(getState(), bookAddress).keypair;
  let encryptedMessage = bookKeypair.encryptPrivate(bookAddress, 'base64', 'utf8')
  
  return dispatch(sendViewRequest(encryptedMessage, bookKeypair.exportKey('pkcs8-public-pem')));
};

export const FETCH_STATISTICS_REQUEST = 'FETCH_STATISTICS_REQUEST';
export const FETCH_STATISTICS_SUCCESS = 'FETCH_STATISTICS_SUCCESS';
export const FETCH_STATISTICS_FAILURE = 'FETCH_STATISTICS_FAILURE';

const sendLibraryAndPublisherStatisticsRequest = () => ({
  [CALL_API]: {
    types: [ FETCH_STATISTICS_REQUEST, FETCH_STATISTICS_SUCCESS, FETCH_STATISTICS_FAILURE ],
    verb: 'GET',
    endpoint: 'statistics'
  }
});

export const requestLibraryAndPublisherStatistics = () => (dispatch) => {
  return dispatch(sendLibraryAndPublisherStatisticsRequest());
}

export const FETCH_INFO_REQUEST = 'FETCH_INFO_REQUEST';
export const FETCH_INFO_SUCCESS = 'FETCH_INFO_SUCCESS';
export const FETCH_INFO_FAILURE = 'FETCH_INFO_FAILURE';

const sendBookStatisticsRequest = (bookAddress) => ({
  [CALL_API]: {
    types: [ FETCH_INFO_REQUEST, FETCH_INFO_SUCCESS, FETCH_INFO_FAILURE ],
    verb: 'POST',
    endpoint: 'books/statistics',
    payload: {
      bookAddress
    }
  }
});

export const requestBookStatistics = (bookAddress) => (dispatch) => {
  return dispatch(sendBookStatisticsRequest(bookAddress));
};
