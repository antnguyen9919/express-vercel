// var Highcharts = require("highcharts");

import "../styles/main.css";

import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxybiOd96OWzLLT04G2i2I9YzRe1Jn3_g",
  authDomain: "express-js-management.firebaseapp.com",
  projectId: "express-js-management",
  storageBucket: "express-js-management.appspot.com",
  messagingSenderId: "113062787866",
  appId: "1:113062787866:web:a924d6c598596e4f5a8aa3",
  measurementId: "G-S4L9RR1P3K",
};
const app = getApps().length < 1 ? initializeApp(firebaseConfig) : getApp();
let analytics;
if (process.env.NODE_ENV === "production") {
  analytics = getAnalytics(app);
  logEvent(analytics, "express-app analytics started");
}
function log_something(message) {
  logEvent(analytics, message);
  return;
}
export { log_something };
