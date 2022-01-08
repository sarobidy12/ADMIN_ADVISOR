importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
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

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
    };

    // eslint-disable-next-line no-restricted-globalsa
    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});