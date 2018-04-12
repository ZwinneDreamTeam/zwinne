<template>
  <div>
    <md-card class="createTestCard">
      <md-card-header>
        <h1 class="md-title">Dodaj nowy test</h1>
      </md-card-header>
      <md-field>
        <md-icon>person</md-icon>
        <label>Właściciel testu</label>
        <md-input v-model="userDisplayName" readonly/>
      </md-field>
      <md-field :class="testNameClass">
        <md-icon>title</md-icon>
        <label>Nazwa testu</label>
        <md-input v-model="testModel.name" required v-on:blur="validateTestName()" v-on:keyup="validateTestName()"/>
        <span class="md-error">Wymagana nazwa testu</span>
      </md-field>
    </md-card>
    <md-card class="createTestCard">
      TODO: Pytania
    </md-card>
    <md-button @click="submit_click" class="md-raised md-primary confirmButton">Dodaj test</md-button>
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: "create-test",
    data() {
      return {
        userDisplayName: "",
        testModel: {
          isActive: true
        },
        isTestNameValid: true,
      };

    },
    mounted() {
      let currentAuthUser = firebase.auth().currentUser;
      this.testModel.ownerUid = currentAuthUser.uid;
      firebase.database().ref("users/" + currentAuthUser.uid).on('value', (snapshot) => {
        this.userDisplayName = snapshot.val().username;
      });
    },
    methods: {
      validateTestName() {
        this.isTestNameValid = Boolean(this.testModel.name) && Boolean(this.testModel.name.trim());
      },
      submit_click() {
        this.validateTestName();
        if (this.isTestNameValid) {
          firebase.database().ref("tests").push(this.testModel).then(() => {
            this.$router.push({name: 'created-tests'});
          });
        }
      },
    },
    computed: {
      testNameClass() {
        return {
          'md-invalid': !this.isTestNameValid
        }
      }
    }
  }
</script>

<style scoped>

  .createTestCard {
    padding: 16px;
    margin-bottom: 16px;
  }

  .confirmButton {
    margin-left: 16px;
  }
</style>
