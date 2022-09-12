import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import "firebase/firestore";

const config = {
  apiKey: "AIzaSyCz7WItBQd4ECIMLMSs6IOObmU-hLDqbUY",
  authDomain: "todo-app-358a9.firebaseapp.com",
  projectId: "todo-app-358a9",
  storageBucket: "todo-app-358a9.appspot.com",
  messagingSenderId: "421629949199",
  appId: "1:421629949199:web:544834e5cf9dd86d2e7a7a",
  measurementId: "G-2HTR6E7E3J",
};

//initialize firebase
if (!getApps().length) {
  initializeApp(config);
}

export const db = getFirestore();
