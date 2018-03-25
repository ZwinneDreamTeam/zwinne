"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.OnCreateFunction = functions.auth.user().onCreate((event) => {
    var userId = event.data.uid;
    admin.database().ref('users/' + userId).set({
        username: event.data.displayName,
        email: event.data.email,
        isCandidate: true,
        isRedactor: false,
        isModerator: false,
    });
});
//# sourceMappingURL=index.js.map