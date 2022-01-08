import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from './serviceWorker';
import reportWebVitals from "./reportWebVitals";
import store from "./config/store";
import { Provider } from "react-redux";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { initializeFirebase } from "./Firebase/Firebase";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.register();

initializeFirebase();

reportWebVitals(console.log);
