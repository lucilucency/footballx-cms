/* eslint-disable max-len */
// import * as firebase from 'firebase';
//
// const prodConfig = {
//   apiKey: 'AIzaSyCGjNTtY-6Ec0rxRh-HRQqFt1MlQ6YODDY',
//   authDomain: 'footballx-dev.firebaseapp.com',
//   databaseURL: 'https://footballx-dev.firebaseio.com',
//   projectId: 'footballx-dev',
//   storageBucket: 'footballx-dev.appspot.com',
//   messagingSenderId: '738646846066',
//   keyPair: 'BGMXAkBgIfCEC-dyt9NZsjSzRQxDtm9NBbQ8B5xFi_Jmkv0T1d9ugn3wbuRuC-5PcZfZgWIOqGt9QUot98m2xfw',
// };
//
// const devConfig = {
//   apiKey: 'AIzaSyCGjNTtY-6Ec0rxRh-HRQqFt1MlQ6YODDY',
//   authDomain: 'footballx-dev.firebaseapp.com',
//   databaseURL: 'https://footballx-dev.firebaseio.com',
//   projectId: 'footballx-dev',
//   storageBucket: 'footballx-dev.appspot.com',
//   messagingSenderId: '738646846066',
//   keyPair: 'BGMXAkBgIfCEC-dyt9NZsjSzRQxDtm9NBbQ8B5xFi_Jmkv0T1d9ugn3wbuRuC-5PcZfZgWIOqGt9QUot98m2xfw',
// };
//
// export const firebaseConfig = process.env.NODE_ENV === 'production'
//   ? prodConfig
//   : devConfig;
//
// if (!firebase.apps || !firebase.apps.length) {
//   console.log('going to initialize firebase app');
//   firebase.initializeApp(firebaseConfig);
// }
//
// function subscribeTokenToTopic(token, topic) {
//   fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
//     method: 'POST',
//     headers: new Headers({
//       Authorization: `key=${'AAAAq_rIanI:APA91bHw-TX4tle78nywfwFtwX5iWTvPgK62EwMbPWX4pTaaXMF8FpTRdZWIMfh8ePsmuN2CEmvnwzLiobtkJtFAAEVTuptU0l41bXh9Y_zvC82f8TmDXZCzItv8DWcGvaJ-j0cDTmND'}`,
//       'Content-Type': 'application/json',
//     }),
//   }).then((response) => {
//     if (response.status < 200 || response.status >= 400) {
//       // eslint-disable-next-line no-throw-literal
//       throw `Error subscribing to topic: ${response.status} - ${response.text()}`;
//     }
//     console.log('Subscribed to topic: ', topic);
//   }).catch((error) => {
//     console.error(error);
//   });
// }
//
// const FIREBASE_MESSAGING = firebase.messaging();
// /* request permission for receiving notification */
// FIREBASE_MESSAGING.usePublicVapidKey(firebaseConfig.keyPair);
// FIREBASE_MESSAGING.requestPermission()
//   .then(() => {
//     console.log('Notification permission granted.');
//     // TODO(developer): Retrieve an Instance ID token for use with FCM.
//     FIREBASE_MESSAGING.getToken()
//       .then((currentToken) => {
//         if (currentToken) {
//           console.log('token: ', currentToken);
//           subscribeTokenToTopic(currentToken, 'event-200-checkin');
//         } else {
//           // Show permission request.
//           console.log('No Instance ID token available. Request permission to generate one.');
//           // Show permission UI.
//         }
//       })
//       .catch((err) => {
//         console.log('An error occurred while retrieving token. ', err);
//       });
//   })
//   .catch((err) => {
//     console.log('Unable to get permission to notify.', err);
//   });
//
// function setTokenSentToServer(sent) {
//   window.localStorage.setItem('sentToServer', sent ? 1 : 0);
// }
//
// function isTokenSentToServer() {
//   return window.localStorage.getItem('sentToServer') == 1;
// }
//
// function sendTokenToServer(currentToken) {
//   if (!isTokenSentToServer()) {
//     console.log('Sending token to server...');
//     // TODO(developer): Send the current token to your server.
//     setTokenSentToServer(true);
//   } else {
//     console.log('Token already sent to server so won\'t send it again ' +
//       'unless it changes');
//   }
// }
//
// function handleTokenRefresh() {
//   return FIREBASE_MESSAGING.getToken().then((token) => {
//     console.log('handle token refresh');
//     setTokenSentToServer(true);
//   });
// }
//
// function subscribeToNotifications() {
//   console.log('do subscribe');
//   FIREBASE_MESSAGING.requestPermission()
//     .then(() => handleTokenRefresh())
//     .catch((err) => {
//       console.log('error getting permission', err);
//     });
// }
//
// function unsubscribeFromNotifications() {
//   console.log('un subscribe');
//   FIREBASE_MESSAGING.getToken()
//     .then(token => FIREBASE_MESSAGING.deleteToken(token))
//     .catch((err) => {
//       console.log('error deleting token :(', err);
//     });
// }
//
//
// FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);
//
//
// export {
//   FIREBASE_MESSAGING,
//   subscribeToNotifications,
//   unsubscribeFromNotifications,
//   subscribeTokenToTopic,
// };
