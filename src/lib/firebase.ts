import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBou24ENOdkvaI7LKzv53zZmm7p2FwuwEU',
  authDomain: 'skyweather-c1111.firebaseapp.com',
  projectId: 'skyweather-c1111',
  storageBucket: 'skyweather-c1111.firebasestorage.app',
  messagingSenderId: '1046838227875',
  appId: '1:1046838227875:web:7872145a3847c8ffc2a016',
  measurementId: 'G-SP1YNG1F6D',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});
