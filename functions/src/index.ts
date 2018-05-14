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

const nodemailer = require('nodemailer');
// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;

const APP_NAME = 'ZwinneXD';

const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zwinne.kod.schrodingera@gmail.com',
    pass: 'zwinne1234',
  },
});

exports.sendEvaluation = functions.https.onRequest((email, message) => {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
    subject: "Evaluation",
    text: message
  };
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Evaluation email send to :', email);
  });
});
