importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBt5xCXINLzU4B2r9C9KdISVlqNeLnbMH8",
    authDomain: "menuadvisor-f06d2.firebaseapp.com",
    databaseURL: "https://menuadvisor-f06d2.firebaseio.com",
    projectId: "menuadvisor-f06d2",
    storageBucket: "menuadvisor-f06d2.appspot.com",
    messagingSenderId: "886054910744",
    appId: "1:886054910744:web:78aa961c8e157fec3e7c6d",
    measurementId: "G-FB5SQB4ZFY"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();