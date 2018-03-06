import * as firebase from 'firebase';
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

const prodConfig = {
  apiKey: 'AIzaSyA65s_6yPsTyvoRUNJ6zkSe1JfB0hokd5M',
  authDomain: 'footballx-f8db2.firebaseapp.com',
  databaseURL: 'https://footballx-f8db2.firebaseio.com',
  projectId: 'footballx-f8db2',
  storageBucket: 'footballx-f8db2.appspot.com',
  messagingSenderId: '318454074670',
};

const devConfig = {
  apiKey: 'AIzaSyCGjNTtY-6Ec0rxRh-HRQqFt1MlQ6YODDY',
  authDomain: 'footballx-dev.firebaseapp.com',
  databaseURL: 'https://footballx-dev.firebaseio.com',
  projectId: 'footballx-dev',
  storageBucket: 'footballx-dev.appspot.com',
  messagingSenderId: '738646846066',
  keyPair: 'BGMXAkBgIfCEC-dyt9NZsjSzRQxDtm9NBbQ8B5xFi_Jmkv0T1d9ugn3wbuRuC-5PcZfZgWIOqGt9QUot98m2xfw',
};

const config = process.env.NODE_ENV === 'production'
  ? prodConfig
  : devConfig;

if (!firebase.apps || !firebase.apps.length) {
  console.log('going to initialize firebase app');
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const storage = firebase.storage();
const messaging = firebase.messaging();
messaging.usePublicVapidKey(config.keyPair);
messaging.requestPermission()
  .then(() => {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve an Instance ID token for use with FCM.
    // ...
  })
  .catch((err) => {
    console.log('Unable to get permission to notify.', err);
  });


function setTokenSentToServer(sent) {
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}
function isTokenSentToServer() {
  return window.localStorage.getItem('sentToServer') === 1;
}
// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken) {
  console.log('currentToken: ', currentToken);
  if (!isTokenSentToServer()) {
    console.log('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
  } else {
    console.log('Token already sent to server so won\'t send it again ' +
      'unless it changes');
  }
}

messaging.onTokenRefresh(() => {
  messaging.getToken()
    .then((refreshedToken) => {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
    })
    .catch((err) => {
      console.log('Unable to retrieve refreshed token ', err);
    });
});
// [END refresh_token]
// [START receive_message]
// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a sevice worker
//   `messaging.setBackgroundMessageHandler` handler.
messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
});
function requestPermission() {
  console.log('Requesting permission...');
  // [START request_permission]
  messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
    })
    .catch((err) => {
      console.log('Unable to get permission to notify.', err);
    });
  // [END request_permission]
}
function deleteToken() {
  // Delete Instance ID token.
  // [START delete_token]
  messaging.getToken()
    .then((currentToken) => {
      messaging.deleteToken(currentToken)
        .then(() => {
          console.log('Token deleted.');
          setTokenSentToServer(false);
        })
        .catch((err) => {
          console.log('Unable to delete token. ', err);
        });
      // [END delete_token]
    })
    .catch((err) => {
      console.log('Error retrieving Instance ID token. ', err);
    });
}
// Add a message to the messages element.
function appendMessage(payload) {
  const messagesElement = document.querySelector('#messages');
  const dataHeaderELement = document.createElement('h5');
  const dataElement = document.createElement('pre');
  dataElement.style = 'overflow-x:hidden;'
  dataHeaderELement.textContent = 'Received message:';
  dataElement.textContent = JSON.stringify(payload, null, 2);
  messagesElement.appendChild(dataHeaderELement);
  messagesElement.appendChild(dataElement);
}
// Clear the messages element of all children.
function clearMessages() {
  const messagesElement = document.querySelector('#messages');
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}

export {
  auth, storage, messaging,
};
