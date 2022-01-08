import { hot } from "react-hot-loader";
import { FC, useEffect, useRef,useState} from "react";
import { MuiThemeProvider } from "@material-ui/core";
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
import { getMessaging, getToken } from "firebase/messaging";
import firebase from "firebase/compat/app";
import {onMessageListener} from "./Firebase/Firebase";


const App: FC = () => {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

  console.log(show, notification);

  onMessageListener()
    .then((payload:any) => {
      
      setShow(true);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("./firebase-messaging-sw.js")
          .then(function (registration) {
            if (Notification.permission == "granted") {
              navigator.serviceWorker.getRegistration().then(function (reg: any) {
                reg.showNotification(payload.notification.title, {
                  body: payload.notification.body,
                  icon: "https://admin-advisor.voirlemenu.fr/static/media/logo.8da5d5e8.png",
                });
              });
            }
          })
          .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
          });
      }

      console.log(payload);

    })
    .catch((err) => console.log("failed: ", err));

  const messaging = getMessaging();

  const interval = useRef<number>();

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
