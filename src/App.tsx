import { hot } from "react-hot-loader";
import { FC, useEffect, useState } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { defaultTheme } from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes/Routes";
import { SnackbarProvider } from "notistack";
import { AuthConsumer, AuthProvider } from "./providers/authentication";
import Loading from "./components/Common/Loading";
import { ConfirmProvider } from "material-ui-confirm";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { ImageViewerProvider } from "./components/Common/ImageViewer";
import { onMessageListener } from "./Firebase/Firebase";
import { getMessaging, getToken } from "firebase/messaging";
import { askForPermissionToReceiveNotifications } from "./Firebase/Firebase";
import ReactNotificationComponent from "./components/Notifications/ReactNotification";
import firebase from "firebase/compat/app";
import request from "request";

const App: FC = () => {
  const [show, setShow] = useState("SHOW TOKEN");
  const [notification, setNotification] = useState({ title: "", body: "" });

  useEffect(() => {
    setInterval(() => {
      onMessageListener()
        .then((payload: any) => {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
          });
          console.log("payload", payload);
        })
        .catch((err) => console.log("failed: ", err));
    }, 1000);
  });

  useEffect(() => {
    const messaging = getMessaging();

    if (!firebase.messaging.isSupported()) {
      alert(
        "vous ne recevez pas de notification par ce que votre navigateur est incompatible"
      );
    }

    getToken(messaging, {
      vapidKey:
        "BJmO7UXc0phrIYym8zDuP2Hs3hhigy9J_r_Yq6Vn7BW6UQbBq-QnAH-SpbAuKOBQsQieIsk-aigPrI6lmsUOR9g",
    })
      .then((currentToken: any) => {
        if (currentToken) {
          setShow(currentToken);
          sessionStorage.setItem("currentToken", currentToken);
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("-------->. ", err);
      });
  });

  const SendNotification = () => {
    request.post(
      {
        url: "https://fcm.googleapis.com/fcm/send",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "key=AAAAzkz8-xg:APA91bGHoGL6SyhcCmU01UdRdMKI6cKW5ZirZGsTuFHbq24POW6pFyGC0wQPbi5XirB6fh3ZJvfyNDxvN0PhuSHbTQIN1X_Hl8XH6I1waUqVe-INqixKh2dlKJhixW83iVWjZV4A5MN9",
        },
        body: JSON.stringify({
          to: show,
          notification: {
            title: "Titre",
            body: "body",
            icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
            click_action: "https://advisor.voirlemenu.fr/",
          },
          priority: "high",
          android: {
            priority: "high",
          },
          apns: {
            headers: {
              "apns-priority": "5",
            },
          },
          webpush: {
            headers: {
              Urgency: "high",
            },
          },
        }),
      },
      function (error: any, response: any, body: any) {
        alert("send")
        console.log("body---->", body);
        console.log("response---->", body);
      }
    );
  };

  return (
    <>
      tEST
      <br />
      {show}
      <br />
      <Button
        onClick={() => {
          SendNotification();
        }}
        variant="contained" color="primary"
      >
        Send Me
      </Button>
    </>
  );
};

export default hot(module)(App);
