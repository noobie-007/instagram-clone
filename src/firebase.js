import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB9iJ-wwXJigVJq7gFbbGxcO2pMnhe2rIE",
    authDomain: "instagram-clone-a2cd7.firebaseapp.com",
    databaseURL: "https://instagram-clone-a2cd7.firebaseio.com",
    projectId: "instagram-clone-a2cd7",
    storageBucket: "instagram-clone-a2cd7.appspot.com",
    messagingSenderId: "740819507138",
    appId: "1:740819507138:web:36d52116a7cb7ba702e85b",
    measurementId: "G-D72DK1J244"    
}); 

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };