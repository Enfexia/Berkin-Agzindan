var config = {
  apiKey: "AIzaSyApr7fRx8tB0MecEHtUFHiopQGaou6NMC8",
  authDomain: "berkinagzindan.firebaseapp.com",
  databaseURL: "https://berkinagzindan.firebaseio.com",
  projectId: "berkinagzindan",
  storageBucket: "berkinagzindan.appspot.com",
  messagingSenderId: "1038342628297"
};
var app = firebase.initializeApp(config);
var db = firebase.firestore(app);
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
var uid = false;
firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
    // User is signed in.
    uid = user.uid;
    // ...
    //    console.log(uid)
  } else {
    // User is signed out.
    // ...
  }
  // ...
});
window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'UA-61820447-13');