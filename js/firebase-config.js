// Firebase SDK loaded from Google CDN — do not bundle or host firebase packages locally.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-529nCnW_1XmiZroX6OweIfFIijw9aL0",
  authDomain: "brain-3bc3a.firebaseapp.com",
  databaseURL: "https://brain-3bc3a-default-rtdb.firebaseio.com",
  projectId: "brain-3bc3a",
  storageBucket: "brain-3bc3a.appspot.com",
  messagingSenderId: "539536929675",
  appId: "1:539536929675:web:b87657a27ea25aeb34758e",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
