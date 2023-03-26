import {initializeApp, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCulWCf_LtuKMDXXzU7h83CnBwEenrn_n4',
  authDomain: 'animal-app-tda.firebaseapp.com',
  projectId: 'animal-app-tda',
  storageBucket: 'animal-app-tda.appspot.com',
  messagingSenderId: '150425401694',
  appId: '1:150425401694:web:9c6d33d31df008d80377cf',
  measurementId: 'G-VNKH0G1SWM',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
