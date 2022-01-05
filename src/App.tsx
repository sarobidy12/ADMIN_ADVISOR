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
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import firebase from "firebase/compat/app";

const App: FC = () => {

  const messaging = getMessaging();

  // onMessage(messaging, (payload: any) => {
  //   console.log("Message received. ", payload);
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("./firebase-messaging-sw.js")
  //       .then(function (registration) {
  //         if (Notification.permission == "granted") {
  //           navigator.serviceWorker.getRegistration().then(function (reg: any) {
  //             reg.showNotification(payload.notification.title, {
  //               body: payload.notification.body,
  //               icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
  //             });
  //           });
  //         }
  //       })
  //       .catch(function (err) {
  //         console.log("Service worker registration failed, error:", err);
  //       });
  //   }
  // });

  useEffect(() => {
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
      <MuiThemeProvider theme={defaultTheme}>
        <SnackbarProvider maxSnack={3}>
          <ConfirmProvider>
            <ImageViewerProvider>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <Router>
                  <AuthProvider>
                    <AuthConsumer>
                      {({ initialized }) => (
                        <>
                          <Loading open={!initialized} />
                          <Routes />
                        </>
                      )}
                    </AuthConsumer>
                  </AuthProvider>
                </Router>
              </MuiPickersUtilsProvider>
            </ImageViewerProvider>
          </ConfirmProvider>
        </SnackbarProvider>
      </MuiThemeProvider>
    </>
  );
};

export default hot(module)(App);
