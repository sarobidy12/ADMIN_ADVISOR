import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import serviceWorker from "./serviceWorker";
import reportWebVitals from "./reportWebVitals";
import store from "./config/store";
import { Provider } from "react-redux";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { initializeFirebase } from "./Firebase/Firebase";

ReactDOM.render(
      <App />
  ,
  document.getElementById("root")
);

initializeFirebase();

serviceWorker();

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// reportWebVitals(console.log);
