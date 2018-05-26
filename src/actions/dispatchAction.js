/* eslint-disable no-restricted-syntax,no-param-reassign */
/* global FX_API */
/* global FX_VERSION */
import fetch from 'isomorphic-fetch';
import queryString from 'querystring';
import update from 'react-addons-update';

const request = require('superagent');
const FormData = require('form-data');
const FormUrlEncoded = require('form-urlencoded');


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
      options.body = FormUrlEncoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = localStorage.getItem('access_token') || '';

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

    const checkStatus = (response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    };

    function parseJSON(response) {
      try {
        return JSON.parse(response);
      } catch (error) {
        throw error;
      }
    }

    const accessToken = localStorage.getItem('access_token');
    const fetchDataWithRetry = (delay, tries, error) => {
      if (tries < 1) {
        return dispatchFail(error);
      }
      return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(checkStatus)
        .then(response => response.text())
        .then(parseJSON)
        .then((body) => {
          let dispatchData = body.data;
          if (transform) {
            dispatchData = transform(dispatchData);
          }
          return dispatch(dispatchOK(dispatchData));
        })
        .catch((err) => {
          if (err.message === 'Unauthorized') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('account_user');
            localStorage.removeItem('account_hotspot');
            window.location.href = '/login';
            return null;
          }

          return dispatch(dispatchFail(err.response ? err.response.body.message : err));
        });


      // return request
      //   .get(url)
      //   .set('Content-Type', 'application/x-www-form-urlencoded')
      //   .set('Authorization', `Bearer ${accessToken}`)
      //   .query({}) // query string
      //   .then((res, err) => {
      //     if (!err) {
      //       let dispatchData = res.body.data;
      //       if (transform) {
      //         dispatchData = transform(res.body.data);
      //       }
      //       return dispatch(dispatchOK(dispatchData));
      //     }
      //     return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, res.body.message), delay);
      //   })
      //   .catch((err) => {
      //     console.log(`Error in ${type}`);
      //     console.log(err);
      //
      //     if (err.message === 'Unauthorized') {
      //       localStorage.removeItem('access_token');
      //       localStorage.removeItem('account_user');
      //       localStorage.removeItem('account_hotspot');
      //       window.location.href = '/login';
      //       return null;
      //     }
      //
      //     return dispatch(dispatchFail(err.response ? err.response.body.message : err));
      //   });
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
      options.body = FormUrlEncoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = localStorage.getItem('access_token') || '';

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
          console.log(`Error in ${type}`);
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
      options.body = FormUrlEncoded(params);
      options.contentType = 'application/x-www-form-urlencoded';
    }

    const accessToken = localStorage.getItem('access_token') || '';

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
          console.log(`Error in ${type}`);
          return dispatch(dispatchFail((err.response && err.response.body) ? err.response.body.message : err));
        });
    };

    dispatch(dispatchStart());
    return fetchDataWithRetry(1000, 1);
  };
}
