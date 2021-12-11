importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('../firebase-messaging-sw.js')
//         .then(function(registration) {
//             console.log('Registration successful, scope is:', registration.scope);
//         }).catch(function(err) {
//             console.log('Service worker registration failed, error:', err);
//         });
// }

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

// eslint-disable-next-line no-undef

firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-undef

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {

//     console.log("Received background message ", payload);

//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: "/logo192.png",
//     };

//     //     // eslint-disable-next-line no-restricted-globals
//     return self.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//     );
// });