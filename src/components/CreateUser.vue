<template>
  <div>
    <md-card style="padding : 10px;">
      <md-card-header>
        <h1 class="md-title">Create new account</h1>
      </md-card-header>

      <md-field>
        <md-icon>person</md-icon>
        <label>Username</label>
        <md-input v-model="username" type="text" required/>
        <span class="md-error">There is an error</span>
      </md-field>

      <md-field>
        <md-icon>email</md-icon>
        <label>Email</label>
        <md-input v-model="email" type="email" required/>
        <span class="md-error">There is an error</span>
      </md-field>

      <md-field>
        <md-icon>lock</md-icon>
        <label>Password</label>
        <md-input v-model="password" type="password" required/>
        <span class="md-error">There is an error</span>
      </md-field>

      <div>
        <label>Permissions:</label>
        <div>
          <md-switch class="md-primary" v-model="isModerator">
            <label>Moderator</label>
          </md-switch>
        </div>
        <div>
          <md-switch class="md-primary" v-model="isCandidate">
            <label>Candidate</label>
          </md-switch>
        </div>
        <div>
          <md-switch class="md-primary" v-model="isRedactor">
            <label> Redactor</label>
          </md-switch>
        </div>
      </div>
      <md-button @click="submit_click" class="md-raised md-primary"> {{addUser}}</md-button>
    </md-card>
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
