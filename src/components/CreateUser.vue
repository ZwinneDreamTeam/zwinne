<template>
  <div>
    <md-card style="padding : 10px;">
      <md-card-header>
        <h1 class="md-title">Create new account</h1>
      </md-card-header>

      <md-field :class="usernameClass">
        <md-icon>person</md-icon>
        <label>Username</label>
        <md-input v-model="username" type="text" v-on:keyup="fromIncorrecUsernameToCorrect()" v-on:blur="isUsernameValid()" required/>
        <span class="md-error">A username must contain at least five characters</span>
      </md-field>

      <md-field :class="emailClass">
        <md-icon>email</md-icon>
        <label>Email</label>
        <md-input v-model="email" type="email" v-on:keyup="fromIncorrecEmailToCorrect()" v-on:blur="isEmailValid()" required/>
        <span class="md-error">Please provide valid email address</span>
      </md-field>

      <md-field :class="passwordClass">
        <md-icon>lock</md-icon>
        <label>Password</label>
        <md-input v-model="password" type="password" v-on:keyup="fromIncorrecPasswordToCorrect" v-on:blur="isPasswordValid()" required/>
        <span class="md-error">A password must contain at least eight characters</span>
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
      addUser: "Submit",
      validEmail: true,
      validUsername: true,
      validPassword: true
    }),
    methods: {
      submit_click: function (event) {
        if (this.isValid()) {
          createAccountFirebase.createUserWithEmailAndPassword(this.$data.email, this.$data.password)
            .then(user => createUser(user, this.$data.isCandidate, this.$data.isModerator, this.$data.isRedactor, this.$data.username))
            .catch(function (error) {
              alert(error.message);
            });
        }
      },
      isValid: function () {

        let passwordValid = this.isPasswordValid();
        let emailValid = this.isEmailValid();
        let usernameValid = this.isUsernameValid();
        return emailValid && passwordValid && usernameValid;
      },
      isPasswordValid: function () {
        this.$data.validPassword = this.$data.password.length >= 5;
        return this.$data.validPassword;
      },
      isUsernameValid: function () {
        this.$data.validUsername = this.$data.username.length >= 5;
        return this.$data.validUsername;
      },
      isEmailValid: function () {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.$data.validEmail = re.test(this.$data.email);
        return this.$data.validEmail;
      },
      fromIncorrecEmailToCorrect: function(){
        if(this.$data.validEmail) return;
        this.isEmailValid();
      },
      fromIncorrecPasswordToCorrect: function(){
        if(this.$data.validPassword) return;
        this.isPasswordValid();
      },
      fromIncorrecUsernameToCorrect: function(){
        if(this.$data.validUsername) return;
        this.isUsernameValid();
      }
    },
    computed: {
      usernameClass() {
        return {
          'md-invalid': !this.validUsername
        }
      },
      emailClass() {
        return {
          'md-invalid': !this.validEmail
        }
      },
      passwordClass() {
        return {
          'md-invalid': !this.validPassword
        }
      }
    }
  }
</script>

<style scoped>
</style>
