import { hot } from 'react-hot-loader';
import { FC, useEffect, useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { defaultTheme } from './theme';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes/Routes';
import { SnackbarProvider } from 'notistack';
import { AuthConsumer, AuthProvider } from './providers/authentication';
import Loading from './components/Common/Loading';
import { ConfirmProvider } from 'material-ui-confirm';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { ImageViewerProvider } from './components/Common/ImageViewer';
import { onMessageListener } from './Firebase/Firebase';
import { getMessaging, getToken } from "firebase/messaging";
import ReactNotificationComponent from "./components/Notifications/ReactNotification";
import firebase from "firebase/compat/app";

const App: FC = () => {

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });

  onMessageListener()
    .then((payload: any) => {
      setShow(true);
      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
      });
      console.log("payload", payload);
    })
    .catch((err) => console.log("failed: ", err));

  console.log(show, notification);

  useEffect(() => {

    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.

    const messaging = getMessaging();

    if (firebase.messaging.isSupported()) {
      alert("ok")
    } else {
      alert("unsuported")
    }

    getToken(messaging, { vapidKey: 'BJmO7UXc0phrIYym8zDuP2Hs3hhigy9J_r_Yq6Vn7BW6UQbBq-QnAH-SpbAuKOBQsQieIsk-aigPrI6lmsUOR9g' })
      .then((currentToken: any) => {

        if (currentToken) {

          sessionStorage.setItem("currentToken", currentToken)

        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
          // ...
        }
      }).catch(err => {

        alert(err);

        console.log('-------->. ', err);

      });
  })

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
}

export default hot(module)(App);
