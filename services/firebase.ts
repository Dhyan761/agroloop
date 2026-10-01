// Firebase configuration and initialization
// TODO: Configure Firebase project and replace with your config

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Replace with your Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// TODO: Initialize Firebase
// import { initializeApp } from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// const app = initializeApp(firebaseConfig);
// export { auth, firestore };

export default firebaseConfig;