import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

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

const messaging = (firebase as any).messaging();

const publicKey ="BJmO7UXc0phrIYym8zDuP2Hs3hhigy9J_r_Yq6Vn7BW6UQbBq-QnAH-SpbAuKOBQsQieIsk-aigPrI6lmsUOR9g";

export const getToken = async (setTokenFound: any) => {
  
  let currentToken = "";

  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload: any) => {
      resolve(payload);
    });
  });

  
export const initializeFirebase = () => {

  firebase.initializeApp({
    apiKey: "AIzaSyBt5xCXINLzU4B2r9C9KdISVlqNeLnbMH8",
    authDomain: "menuadvisor-f06d2.firebaseapp.com",
    databaseURL: "https://menuadvisor-f06d2.firebaseio.com",
    projectId: "menuadvisor-f06d2",
    storageBucket: "menuadvisor-f06d2.appspot.com",
    messagingSenderId: "886054910744",
    appId: "1:886054910744:web:78aa961c8e157fec3e7c6d",
    measurementId: "G-FB5SQB4ZFY"
  });

  const messaging = firebase.messaging();

  messaging.onMessage((payload) => {
    
    //For showing firebase notification in app (not background)

    console.log("onMessage");

    if ("serviceWorker" in navigator) {
      
      navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(function (registration) {
          if (Notification.permission == "granted") {
            navigator.serviceWorker.getRegistration().then(function (reg: any) {
              reg.showNotification(payload.notification.title, {
                body: "payload.notification.body",
                icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
              });
            });
          }
        })
        .catch(function (err) {
          console.log("Service worker registration failed, error:", err);
        });
    }

  });
  
};
