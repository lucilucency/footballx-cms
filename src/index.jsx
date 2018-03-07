import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter } from 'react-router-dom';
import store from 'store';
import { getUserMetadata } from 'actions';
import App from 'components/App';
// import registerServiceWorker from './registerServiceWorker'

// Import global CSS
import 'c3/c3.css';
import 'components/tooltip.css';
import './index.css';

/* Register A service worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Fetch metadata (used on all pages)
// store.dispatch(getMetadata());
store.dispatch(getUserMetadata());

const reactElement = document.getElementById('react');
render(<Provider store={store}>
  <BrowserRouter>
    <Route component={App} />
  </BrowserRouter>
</Provider>, reactElement);

// registerServiceWorker();
