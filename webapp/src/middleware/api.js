import requestSa from 'superagent';

const API_ROOT = 'http://localhost:4040/api/';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, authentificate, payload, verb) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;
  
  let request = requestSa   

  switch (verb) {
  case 'GET':
    /* eslint-disable-next-line */
    console.log('GET') 
    request = request.get(fullUrl);
    break;
  case 'POST':
    console.log('POST')
    request = request.post(fullUrl);
    break;
  case 'PUT':
    console.log('PUT')
    request = request.put(fullUrl);
    break;
  case 'DELETE':
    console.log('DELETE')
    request = request.del(fullUrl);
    break;
  default:
    request = request.get(fullUrl);
  };

  request = request
                .set('Accept', 'application/json') 
                .set('Content-Type', 'application/json; charset=utf-8')

  if (authentificate) {
    console.log('AUTH')

    request = request.set('Authorization', `Bearer ${localStorage.getItem('loginToken')}`);
  }

    console.log('PAYLOAD', payload)
  if (payload) {
    request = request.send(payload);
  }
  console.log('SENDING', request);

  return request.then(response => {
    console.log(response);
    if (!response.ok) {
      return Promise.reject(response.text);
    }

    return response.body;
  });
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint, payload } = callAPI;
  const { types, verb, authentificate } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [ requestType, successType, failureType ] = types;
  next(actionWith({ type: requestType }));

  return callApi(endpoint, authentificate, payload, verb).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  );
};
