import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const firebaseConfig = {
//     apiKey: process.env.APIKEY,
//     authDomain: process.env.AUTH_DOMAIN,
//     projectId: process.env.PROJECT_ID,
//     storageBucket: process.env.STORAGE_BUCKET,
//     messagingSenderId: process.env.MESSAGING_SENDER,
//     appId: process.env.APP_ID,
//     measurementId: process.env.MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCHeLCCNSlDY-IaZ04dOsgzjcCs7H6X3Ew",
  authDomain: "healthfire-19ed0.firebaseapp.com",
  projectId: "healthfire-19ed0",
  storageBucket: "healthfire-19ed0.appspot.com",
  messagingSenderId: "806412486716",
  appId: "1:806412486716:web:37f69fc2277d8aa72d5b39",
  measurementId: "G-WVRTBHDE1Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
// const db = getFirestore(app);
const firestore = getFirestore(app);
console.log(firestore);
// console.log(db);

export { app, firestore, auth };
