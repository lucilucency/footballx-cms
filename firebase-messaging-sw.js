// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

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

// const firebaseConfig = process.env.NODE_ENV === 'production'
//   ? prodConfig
//   : devConfig;

/* global firebase */
/* global clients */

// TODO: fill in messaging sender id
firebase.initializeApp(devConfig);

const messaging = firebase.messaging();

self.addEventListener('notificationclick', (event) => {
  // Event actions derived from event.notification.data from data received
  const eventURL = event.notification.data;
  event.notification.close();
  if (event.action === 'confirmAttendance') {
    clients.openWindow(eventURL.confirm);
  } else {
    clients.openWindow(eventURL.decline);
  }
}, false);

messaging.setBackgroundMessageHandler((payload) => {
  // Parses data received and sets accordingly
  const data = JSON.parse(payload.data.notification);
  const notificationTitle = data.title;
  const notificationOptions = {
    body: data.body,
    icon: 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png',
    actions: [
      { action: 'confirmAttendance', title: '👍 Confirm attendance' },
      { action: 'cancel', title: '👎 Not coming' },
    ],
    // For additional data to be sent to event listeners, needs to be set in this data {}
    data: { confirm: data.confirm, decline: data.decline },
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// messaging.setBackgroundMessageHandler((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   var notificationTitle = 'Background Message Title';
//   var notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };
//
//   return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });