<template>
  <div>
    <md-card style="padding : 10px;">
      <md-card-header>
        <h1 class="md-title headerTitle">Create new account</h1>
      </md-card-header>

      <md-field :class="usernameClass">
        <md-icon>person</md-icon>
        <label>Username</label>
        <md-input v-model="username" type="text" v-on:keyup="validateUsernameIfIncorrect()"
                  v-on:blur="validateUsername()" required/>
        <span class="md-error">A username must contain at least five characters</span>
      </md-field>

      <md-field :class="emailClass">
        <md-icon>email</md-icon>
        <label>Email</label>
        <md-input v-model="email" type="email" v-on:keyup="validateEmailIfIncorrect()" v-on:blur="validateEmail()"
                  required/>
        <span class="md-error">Please provide valid email address</span>
      </md-field>

      <md-field :class="passwordClass">
        <md-icon>lock</md-icon>
        <label>Password</label>
        <md-input v-model="password" type="password" v-on:keyup="validatePasswordIfIncorrect()"
                  v-on:blur="validatePassword()" required/>
        <span class="md-error">A password must contain at least eight characters</span>
      </md-field>

      <div v-if="isCurrentUser">
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
  import {db} from "../App"
  import firebase from 'firebase'
  import {config} from "../App"



  const createAccountFirebase = firebase.initializeApp(config, "create_account_instance").auth();

  function signNewUserOut() {
    createAccountFirebase.signOut();
  }

  export default {
    name: "create-account",
    data: () => ({
      email: "",
      username: "",
      isModerator: false,
      isCandidate: false,
      isRedactor: false,
      edit: "Edit",
      apply: "Apply",
      password: "",
      addUser: "Submit",
      validEmail: true,
      validUsername: true,
      validPassword: true,
      isCurrentUser: false
    }),
    methods: {
      submit_click(event) {
        if (this.isValid() && this.isCurrentUser) {
          createAccountFirebase.createUserWithEmailAndPassword(this.$data.email, this.$data.password)
            .then((user) => {
              let userForDatabase = {
                email: user.email,
                isCandidate: this.$data.isCandidate,
                isModerator: this.$data.isModerator,
                isRedactor: this.$data.isRedactor,
                username: this.$data.username
              };
              db.ref('/users/' + user.uid).set(userForDatabase);
              signNewUserOut();
              this.$router.replace({name: 'users'});
            })
            .catch(function (error) {
              alert(error.message);
            });
        }
        else if (this.isValid() && !this.isCurrentUser) {
          firebase.auth().createUserWithEmailAndPassword(this.$data.email, this.$data.password)
            .then((user) => {
              let userForDatabase = {
                email: user.email,
                isCandidate: true,
                isModerator: false,
                isRedactor: false,
                username: this.$data.username
              };
              db.ref('/users/' + user.uid).set(userForDatabase);
              this.$router.push('/');
            })
            .catch(function (error) {
              alert(error.message);
            });
        }
      },
      isValid: function () {

        let passwordValid = this.validatePassword();
        let emailValid = this.validateEmail();
        let usernameValid = this.validateUsername();
        return emailValid && passwordValid && usernameValid;
      },
      validatePassword: function () {
        this.$data.validPassword = this.$data.password.length >= 8;
        return this.$data.validPassword;
      },
      validateUsername: function () {
        this.$data.validUsername = this.$data.username.length >= 5;
        return this.$data.validUsername;
      },
      validateEmail: function () {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.$data.validEmail = re.test(this.$data.email);
        return this.$data.validEmail;
      },
      validateEmailIfIncorrect: function () {
        if (this.$data.validEmail) return;
        this.validateEmail();
      },
      validatePasswordIfIncorrect: function () {
        if (this.$data.validPassword) return;
        this.validatePassword();
      },
      validateUsernameIfIncorrect: function () {
        if (this.$data.validUsername) return;
        this.validateUsername();
      },
      checkIfUserIsLogIn: function () {
        let currentUser = firebase.auth().currentUser;
        if (currentUser) this.isCurrentUser = true;
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
    },
    beforeMount() {
      this.checkIfUserIsLogIn();
    }
  }
</script>

<style scoped>
</style>
