<template>
  <div class="logInView" >
    <md-dialog :md-active.sync="shouldShowDialog" layout-padding class="forgot-password-dialog">
      <md-dialog-title>{{forgotPasswordDialogTitle}}</md-dialog-title>
      <md-field>
        <label>{{forgotPasswordPlaceholderText}}</label>
        <md-input v-model="resetPasswordEmail"/>
      </md-field>
      <md-button v-on:click="handleForgotPassword" class="md-raised registerButton">{{forgotPasswordSend}}</md-button>
    </md-dialog>
    <md-card class="loginPanelView" >
       <md-card-header>
         <h1 class="md-title">{{loginLabel}}</h1>
       </md-card-header>
       <md-field >
         <md-icon>person</md-icon>
         <label>{{emailLabel}}</label>
         <md-input v-model="email" type="text" required/>
       </md-field>
       <md-field >
         <md-icon>lock</md-icon>
         <label>{{passwordLabel}}</label>
         <md-input v-model="password" type="password" required/>
       </md-field>
       <div>
       <md-button v-on:click="confirmLogIn()" class="md-raised registerButton">{{confirm}}</md-button>
       </div>
       <h2 class="md-title">{{orLabel}}</h2>
      <md-button v-on:click="doLogin" class="md-raised logInButton">{{zalogujMsg}}</md-button>
      <md-button  :to="{ name: 'Register'}" class="md-raised logInButton registerButton">{{register}}</md-button>
      <md-button v-on:click="showForgotPasswordDialog" class="md-raised logInButton forgotPasswordButton">{{forgotPasswordLabel}}</md-button>

    </md-card>
  </div>
</template>

<script>
  import firebase from 'firebase'

  let provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  export default {
    name: "login",
    data: () => ({
      "zalogujMsg": "Kontynuuj z Google",
      "register": "Zarejestruj się",
      "confirm": "Zaloguj",
      "loginLabel": "Zaloguj się",
      "emailLabel": "Email",
      "passwordLabel": "Hasło",
      "orLabel": "Albo...",
      "forgotPasswordLabel": "Zapomniałem hasła",
      "forgotPasswordDialogTitle": "Reset hasła",
      "forgotPasswordPlaceholderText": "Podaj adres e-mail na który wysłany zostanie link resetujący hasło",
      "forgotPasswordSend": "Wyślij",
      email: "",
      password: "",
      resetPasswordEmail: "",
      shouldShowDialog: false
    }),
    methods: {
      doLogin(event) {
        firebase.auth().signInWithPopup(provider).then((result) => {
          this.$router.push('/');
        }).catch(function(error) {
          alert(error.message);
        });
      },
      confirmLogIn: function(event) {
      firebase.auth().signInWithEmailAndPassword(this.$data.email, this.$data.password).then((result) => {
         this.$router.push('/');
         this.error = false;
        }).catch(function (error) {
         var errorCode = error.code;
         if (errorCode === 'auth/wrong-password') {
           alert('Nieprawidłowe hasło');
         } else if (errorCode === 'auth/user-not-found') {
           alert('Nie istnieje użytkownik o podanym adresie email');
         } else if (errorCode === 'auth/user-disabled') {
           alert('Użytkownik zablokowany');
         } else if (errorCode === 'auth/invalid-email') {
           alert('Niepoprawna struktura adresu email');
         }
        });
      },
      showForgotPasswordDialog() {
        this.shouldShowDialog = true
      },
      handleForgotPassword() {
        let emailAddress = this.resetPasswordEmail;
        firebase.auth().sendPasswordResetEmail(emailAddress).then(() => {
          alert("E-mail z linkiem resetującym hasło został wysłany na podany adres");
          this.shouldShowDialog = false
        }).catch((error) => {
          alert("Użytkownik z podanym adresem e-mail nie istnieje");
        });
      }
    }
  }
</script>

<style >

  .logInButton {
    background-color: #f44336 !important;
    color: #ffffff !important;
    font-size: 12px;
    width: 20vh;
    height: 6vh;
  }

  .registerButton {
    background-color: #3366FF !important;
    color: #ffffff !important;
  }

  .forgotPasswordButton {
    background-color: #bbbbbb !important;
  }

  .logInView {
    text-align: center;
    margin-left: 40vh;
    margin-right: 40vh;
  }
  .loginPanelView {
   text-align: center;
   padding : 10px;
  }
  .forgot-password-dialog {
    padding: 10px !important;
    min-width: 550px !important;
  }

</style>
