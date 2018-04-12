import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

export const OnCreateFunction = functions.auth.user().onCreate((event) => {
  const userId = event.data.uid;
  const userEmail = event.data.email;
  const userName = 'displayName' in event.data ? event.data.displayName : (userEmail.substring(0, userEmail.indexOf('@')))

  let reference = admin.database().ref('users/' + userId);
  reference.once('value', function (snapshot) {
    if (snapshot.val() == null) {
      reference.set({
        username: userName,
        email: userEmail,
        isCandidate: true,
        isRedactor: false,
        isModerator: false,
      });
    }
  });
});
