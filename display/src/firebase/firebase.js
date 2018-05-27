import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

// Initalize and export Firebase.
const config = {
  apiKey: "AIzaSyAq8fWhp6hLzoZLPUxzudWiBBGxKxefrog",
  authDomain: "design-music.firebaseapp.com",
  databaseURL: "https://design-music.firebaseio.com",
  projectId: "design-music",
  storageBucket: "design-music.appspot.com",
  messagingSenderId: "226779029276"
};

export default firebase.initializeApp(config);
