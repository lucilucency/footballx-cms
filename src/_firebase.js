import * as firebase from 'firebase';

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


export {
  auth, storage, messaging,
};