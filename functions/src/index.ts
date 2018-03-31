import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

export const OnCreateFunction = functions.auth.user().onCreate((event) => {
  var userId = event.data.uid;

  admin.database().ref('users/' + userId).set({
    username: 'displayName' in event.data ? event.data.displayName : "",
    email: event.data.email,
    isCandidate: true,
    isRedactor: false,
    isModerator: false,
  });
});
