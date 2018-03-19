import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);


exports.createUserAccount = functions.auth.user().onCreate((event) => {
  var userId = event.data.uid;

  return admin.database().ref('users/' + userId).set({
    username: event.data.displayName,
    email: event.data.email,
    type: 'Candidate'
  });
});
