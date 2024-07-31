import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

import { getFirestore, doc, setDoc, collection, addDoc, getDoc, getDocs, query, where, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDUe74FxI3Tn-hKCTDHmbpflEHfOg9zXC0",
    authDomain: "todo-2024d.firebaseapp.com",
    projectId: "todo-2024d",
    storageBucket: "todo-2024d.appspot.com",
    messagingSenderId: "16251777216",
    appId: "1:16251777216:web:7c32909fbd9a7919167d25",
    measurementId: "G-0JWEGE5RDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export{
    auth, 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,

    db,
    doc, 
    setDoc,
    collection, 
    addDoc,
    getDocs,
    getDoc,
    query, 
    where,
    updateDoc,
    deleteDoc,

    getFirestore,
    storage,
    ref,
    getStorage, 
    uploadBytesResumable,
    getDownloadURL,
}