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

  return (
    <>
      tEST
      <br />
      {show}
    </>
  );
};

export default hot(module)(App);
