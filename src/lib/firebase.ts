// Firebase configuration for RealEarn App
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCvhGuyx6ZSrimCjk2G2Q9pdoihvjb3Hms",
  authDomain: "realearn-app.firebaseapp.com",
  databaseURL: "https://realearn-app.firebaseapp-default-rtdb.firebaseio.com",
  projectId: "realearn-app",
  storageBucket: "realearn-app.firebasestorage.app",
  messagingSenderId: "241034846565",
  appId: "1:241034846565:web:26f6da801689f429f9018c",
  measurementId: "G-WPH8TW221C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

// Sign in with email/password
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    throw error;
  }
};

// Sign up with email/password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error('Email sign-up error:', error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

// Listen for auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
