import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAdrpwqbREnk2raUqm9YGDtMD_qf2oZt8k",
  authDomain: "advisor-b7d65.firebaseapp.com",
  databaseURL: "https://advisor-b7d65-default-rtdb.firebaseio.com",
  projectId: "advisor-b7d65",
  storageBucket: "advisor-b7d65.appspot.com",
  messagingSenderId: "1042310334359",
  appId: "1:1042310334359:web:063c67719a4eb1a15c26d2",
  measurementId: "G-NTZE8BX507",
};

firebase.initializeApp(firebaseConfig);

const messaging = (firebase as any).messaging();

const publicKey ="BKp2V7yB5SASi2jkEw4446MOY-8w7djP4UNPUjzP-x_T3OCQAVhtNb6LWh_5WAqZG1Cga4OgnP3Tu4_gntr_ZTo";

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
    apiKey: "AIzaSyAdrpwqbREnk2raUqm9YGDtMD_qf2oZt8k",
    authDomain: "advisor-b7d65.firebaseapp.com",
    databaseURL: "https://advisor-b7d65-default-rtdb.firebaseio.com",
    projectId: "advisor-b7d65",
    storageBucket: "advisor-b7d65.appspot.com",
    messagingSenderId: "1042310334359",
    appId: "1:1042310334359:web:063c67719a4eb1a15c26d2",
    measurementId: "G-NTZE8BX507",
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
