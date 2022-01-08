importScripts('https://www.gstatic.com/firebasejs/6.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.1.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAdrpwqbREnk2raUqm9YGDtMD_qf2oZt8k",
    authDomain: "advisor-b7d65.firebaseapp.com",
    databaseURL: "https://advisor-b7d65-default-rtdb.firebaseio.com",
    projectId: "advisor-b7d65",
    storageBucket: "advisor-b7d65.appspot.com",
    messagingSenderId: "1042310334359",
    appId: "1:1042310334359:web:063c67719a4eb1a15c26d2",
    measurementId: "G-NTZE8BX507"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();