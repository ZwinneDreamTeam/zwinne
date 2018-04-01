<template>
  <div>

    <h1>Create new account</h1>
    <div>
      Username:
      <input v-model="username" type="text">
    </div>
    <div>
      Email:
      <input v-model="email" type="email">
    </div>
    <div>
      Password:
      <input v-model="password" type="password">
    </div>
    <div>
      Permissions:
      <div>
        <md-switch class="md-primary" v-model="isModerator"> Moderator</md-switch>
      </div>
      <div>
        <md-switch class="md-primary" v-model="isCandidate"> Candidate</md-switch>
      </div>
      <div>
        <md-switch class="md-primary" v-model="isRedactor"> Redactor</md-switch>
      </div>
    </div>
    <md-button @click="submit_click" class="md-primary"> {{addUser}}</md-button>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {config} from "../App"
  import {db} from "../App"

  const createAccountFirebase = firebase.initializeApp(config, "create_account_instance").auth();

  function createUser(user, eIsCandidate, eIsModerator, eIsRedactor, eUsername) {
    if (user) {
      let uid = user.uid;
      let fullUserData = {
        email: user.email,
        isCandidate: Boolean(eIsCandidate),
        isModerator: Boolean(eIsModerator),
        isRedactor: Boolean(eIsRedactor),
        username: eUsername
      };
      db.ref('/users/' + uid).set(fullUserData);
      signNewUserOut();
      window.history.back();
    }
  }

  function signNewUserOut() {
    createAccountFirebase.signOut();
  }

  export default {
    name: "create-account",
    data: () => ({
      email: "",
      username: "",
      isModerator: "",
      isCandidate: "",
      isRedactor: "",
      edit: "Edit",
      apply: "Apply",
      password: "",
      addUser: "Submit"
    }),
    methods: {
      submit_click: function (event) {

        createAccountFirebase.createUserWithEmailAndPassword(this.$data.email, this.$data.password)
          .then(user => createUser(user, this.$data.isCandidate, this.$data.isModerator, this.$data.isRedactor, this.$data.username))
          .catch(function (error) {
            alert(error.message);
          });
      }
    }
  }
</script>

<style scoped>

</style>
