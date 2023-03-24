import {initializeApp, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA7WQQWvM-3DxS7mJBsJmNrJ9FHiIJT0Es',
  authDomain: 'animal-app-61d43.firebaseapp.com',
  projectId: 'animal-app-61d43',
  storageBucket: 'animal-app-61d43.appspot.com',
  messagingSenderId: '336611831235',
  appId: '1:336611831235:web:020e5a352ed5fa104aa176',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
