/* eslint-disable no-restricted-syntax */
/* global FX_API */
/* global FX_VERSION */
import queryString from 'querystring';

const request = require('superagent');
const FormUrlEncoded = require('form-urlencoded');

// eslint-disable-next-line import/prefer-default-export
export const ajaxGet = (path, params = {}, host = `${FX_API}/${FX_VERSION}`) => {
  const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  const accessToken = localStorage.getItem('access_token');

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .get(url)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxGet/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 3);
};

// eslint-disable-next-line import/prefer-default-export
export const ajaxPost = (path, params = {}, host = `${FX_API}/${FX_VERSION}`) => {
  const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  const accessToken = localStorage.getItem('access_token');

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .post(url)
      .send(FormUrlEncoded(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxPost/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 3);
};

// eslint-disable-next-line import/prefer-default-export
export const ajaxPut = (path, params = {}, host = `${FX_API}/${FX_VERSION}`) => {
  const url = `${host}/${path}?${typeof params === 'string' ? params.substring(1) : queryString.stringify(params)}`;
  const accessToken = localStorage.getItem('access_token');

  const fetchDataWithRetry = (delay, tries, error) => {
    if (tries < 1) {
      console.error(error);
      console.error(`Error in ajaxGet/${path}`);
      return false;
    }
    return request
      .put(url)
      .send(FormUrlEncoded(params))
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({}) // query string
      .catch((err) => {
        console.error(`Error in ajaxPost/${path}`);
        console.error(err);
        return setTimeout(() => fetchDataWithRetry(delay + 2000, tries - 1, err), delay);
      });
  };

  return fetchDataWithRetry(3000, 3);
};
