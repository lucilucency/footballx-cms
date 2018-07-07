/* eslint-disable no-restricted-syntax,no-param-reassign */
/* global FX_API */
/* global FX_VERSION */
import queryString from 'querystring';
import update from 'react-addons-update';
import { getCookie } from 'utils';

const request = require('superagent');
const FormData = require('form-data');
const formurlencoded = require('form-urlencoded');


// const FX_API = process.env.FX_API;
// const FX_VERSION = process.env.FX_VERSION;

export function action(type, host, path, params = {}, transform) {
  return (dispatch) => {
    const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatch(dispatchFail(error));
      }
      return fetch(url, path === 'api/metadata' ? { credentials: 'include' } : {})
        .then(response => response.json())
        .then(transform || (json => json))
        .then(json => dispatch(dispatchOK(json)))
        .catch((error) => {
          console.error(error);
          setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, error), delay);
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function fxActionAuth(type = 'auth', path, params = {}, transform) {
  const host = FX_API;
  const v = FX_VERSION;

  return (dispatch) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const options = { method: 'POST' };

    const form = new FormData();

    // eslint-disable-next-line guard-for-in
    for (const key in params) {
      form.append(key, params[key]);
    }
    options.body = form;

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatch(dispatchFail(error));
      }
      return fetch(url, options)
        .then(response => response.json())
        .then(transform || (json => json))
        .then(json => dispatch(dispatchOK(json)))
        .catch((error) => {
          setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, error), delay);
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function dispatchGet({
  auth = true,
  host = FX_API, version = FX_VERSION,
  reducer, path,
  params = {}, transform,
  retries = 1, retriesBreak = 3000,
  callback,
}) {
  return (dispatchAction) => {
    const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

    const dispatchStart = () => ({
      type: `REQUEST/${reducer}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${reducer}`,
      error,
    });

    const accessToken = getCookie('access_token') || '';

    const fetchDataWithRetry = (delay, tries = 1, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }

      let doRequest = request
        .get(url)
        .set('Content-Type', 'application/x-www-form-urlencoded');
      if (auth) {
        doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
      }

      return doRequest
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = res.body;
            if (transform) {
              dispatchData = transform(dispatchData);
            }
            if (callback) callback(dispatchData);
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
        })
        .catch((err) => {
          console.warn(`Error in dispatchGet/${reducer}`);
          console.error(err);
          if (err.message === 'Unauthorized') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('account_user');
            localStorage.removeItem('account_hotspot');
            // window.location.href = '/login';
            return null;
          }

          return dispatchAction(dispatchFail(err.response ? err.response.body.message : err));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(retriesBreak, retries);
  };
}

export function fxActionPost(type, path, params = {}, transform, payload) {
  const host = FX_API;
  const v = FX_VERSION;

  return (dispatch) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const options = { method: 'POST' };
    if (typeof params === 'object') {
      options.body = formurlencoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = getCookie('access_token') || '';

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatch(dispatchFail(error));
      }
      return request
        .post(url)
        .send(options.body)
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({}) // query string
        .then((res, err) => {
          if (!err) {
            let dispatchData = res.body.data;
            dispatchData = transform ? transform(res.body.data) : dispatchData;
            if (payload) {
              if (Array.isArray(payload)) {
                dispatchData = payload;
              } else {
                dispatchData = update(dispatchData, {
                  $merge: payload,
                });
              }
            }

            return dispatch(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
        })
        .catch((err) => {
          console.error(`Error in ${type}`);
          return dispatch(dispatchFail(err.response.body.message));
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function dispatchPost({
  auth = true, host = FX_API, version = FX_VERSION, contentType = 'application/x-www-form-urlencoded',
  retries = 1, retriesBreak = 3000,
  reducer, path,
  params = {},
  transform,
  payload, callback,
  reducerCallback, payloadCallback,
}) {
  return (dispatchAction) => {
    if (typeof reducerCallback === 'string') {
      reducerCallback = [reducerCallback];
      payloadCallback = [payloadCallback];
    }
    const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${reducer}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${reducer}`,
      error,
    });

    const accessToken = getCookie('access_token') || '';

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchAction(dispatchFail(error));
      }

      let doRequest = request
        .post(url)
        .set('Content-Type', contentType);
      if (auth) {
        doRequest = doRequest.set('Authorization', `Bearer ${accessToken}`);
      }

      return doRequest
        .send(formurlencoded(params))
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }
            if (payload) {
              if (Array.isArray(payload)) {
                dispatchData = payload;
              } else {
                dispatchData = update(payload, {
                  $merge: dispatchData,
                });
              }
            }
            if (callback) callback(dispatchData);
            if (reducerCallback && reducerCallback.length) {
              reducerCallback.forEach((el, index) => dispatchAction({
                type: `OK/${el}`,
                payload: payloadCallback[index],
              }));
            }
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.error), delay);
        })
        .catch((err) => {
          console.error(`Error in dispatchPost/${reducer}`);
          if (err.message === 'Unauthorized') {
            console.error('Unauthorized, logging out...');
            // // window.location.href = '/login';
            return null;
          }

          return dispatchAction(dispatchFail(err.message));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(retriesBreak, retries);
  };
}

export function dispatchPut({
  host = FX_API, version = FX_VERSION,
  reducer,
  path,
  params = {},
  transform,
  retries = 1,
  retriesBreak = 3000,
  callback,
}) {
  return (dispatchAction) => {
    const url = `${host}/${version}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${reducer}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${reducer}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${reducer}`,
      error,
    });

    const options = { method: 'PUT' };

    if (typeof params === 'object') {
      options.body = formurlencoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = getCookie('access_token');

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return request
        .put(url)
        .send(options.body)
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          if (res.statusCode === 200) {
            let dispatchData = JSON.parse(res.text);
            if (transform) {
              dispatchData = transform(dispatchData);
            }

            if (callback) callback(dispatchData);
            return dispatchAction(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay, tries - 1, res.error), delay);
        })
        .catch((err) => {
          console.error(`Error in dispatchPut/${reducer}`);
          return dispatchAction(dispatchFail(err.message));
        });
    };

    dispatchAction(dispatchStart());
    return fetchDataWithRetry(retriesBreak, retries);
  };
}

export function fxDispatch(type, payload, transform) {
  return (dispatch) => {
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchData = transform ? transform(payload) : payload;
    return dispatch(dispatchOK(dispatchData));
  };
}


export function fxActionGet(type, path, params = {}, transform) {
  const host = FX_API;
  const v = FX_VERSION;
  return (dispatch) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const accessToken = getCookie('access_token');
    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }

      return request
        .get(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({}) // query string
        .then((res, err) => {
          if (!err) {
            let dispatchData = res.body.data;
            if (transform) {
              dispatchData = transform(res.body.data);
            }
            return dispatch(dispatchOK(dispatchData));
          }
          return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
        })
        .catch((err) => {
          console.error(`Error in ${type}`);
          console.error(err);

          if (err.message === 'Unauthorized') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('account_user');
            localStorage.removeItem('account_hotspot');
            // window.location.href = '/login';
            return null;
          }

          return dispatch(dispatchFail(err.response ? err.response.body.message : err));
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function fxActionPut(type, path, params = {}, transform) {
  const host = FX_API;
  const v = FX_VERSION;
  return (dispatch) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const options = { method: 'PUT' };


    if (typeof params === 'object') {
      options.body = formurlencoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = getCookie('access_token') || '';

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return request
        .put(url)
        .send(options.body)
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res, err) => {
          if (!err) {
            let dispatchData = res.body.data;
            if (transform) {
              dispatchData = transform(res.body.data);
            }
            return dispatch(dispatchOK(dispatchData));
          }
          // return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
          return dispatch(dispatchFail(res.body.message));
        })
        .catch((err) => {
          console.warn(`Error in ${type}`);
          return dispatch(dispatchFail(err.response.body.message));
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}

export function fxActionDelete(type, path, params = {}, transform) {
  const host = FX_API;
  const v = FX_VERSION;
  return (dispatch) => {
    const url = `${host}/${v}/${path}?${typeof params === 'string' ? params.substring(1) : ''}`;

    const dispatchStart = () => ({
      type: `REQUEST/${type}`,
    });
    const dispatchOK = payload => ({
      type: `OK/${type}`,
      payload,
    });
    const dispatchFail = error => ({
      type: `FAIL/${type}`,
      error,
    });

    const options = { method: 'DELETE' };

    if (typeof params === 'object') {
      options.body = formurlencoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = getCookie('access_token') || '';

    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return request
        .delete(url)
        .send(options.body || {})
        .set('Content-Type', options.contentType)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res, err) => {
          if (!err) {
            let dispatchData = res.body.data;
            if (transform) {
              dispatchData = transform(res.body.data);
            }
            return dispatch(dispatchOK(dispatchData));
          }
          // return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
          return dispatch(dispatchFail(res.body.message));
        })
        .catch((err) => {
          console.warn(`Error in ${type}`);
          return dispatch(dispatchFail((err.response && err.response.body) ? err.response.body.message : err));
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}
