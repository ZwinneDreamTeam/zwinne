"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.createUserAccount = functions.auth.user().onCreate((event) => {
    var userId = event.data.uid;
    // var displayName = event.data.displayName;
    return admin.database().ref('users/' + userId).set({
        username: event.data.displayName,
        email: event.data.email,
        type: 'Candidate'
    });
});
//# sourceMappingURL=index.js.map