import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1rVRvmAJQOs4fvn79WU3j-5kSzNiFLOo",
  authDomain: "fixed-4ffa4.firebaseapp.com",
  projectId: "fixed-4ffa4",
  storageBucket: "fixed-4ffa4.appspot.com",
  messagingSenderId: "119907463615",
  appId: "1:119907463615:web:7c60bcc9bbe9fe735bb10a",
  measurementId: "G-0B9ZP61JK0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);