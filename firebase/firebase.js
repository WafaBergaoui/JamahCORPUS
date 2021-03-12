import * as firebase from "firebase";
import firebaseConfig from "./config";
require("firebase/firestore");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
