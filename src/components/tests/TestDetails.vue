<template>
  <div>
    <md-card class="createTestCard">
      <md-card-header>
        <md-card-header-text>
          <h1 class="md-title">Szczegóły testu</h1>
        </md-card-header-text>
        <div v-if="currentUser.isRedactor || currentUser.isModerator">
          <md-switch class="md-primary" v-model="editMode">Tryb edycji</md-switch>
        </div>
      </md-card-header>
      <md-field>
        <md-icon>person</md-icon>
        <md-select class="selectRedactors" v-model="testModel.ownerUid" :placeholder="testModel.ownerName"
                   :disabled="!canChangeOwner">
          <md-option v-for="redactor in redactors" :key="redactor['.key']" :value="redactor['.key']">
            {{redactor.username}}
          </md-option>
        </md-select>
      </md-field>
      <md-field :class="testNameClass">
        <md-icon>title</md-icon>
        <label>Nazwa testu</label>
        <md-input v-model="testModel.name" required v-on:blur="validateTestName()" v-on:keyup="validateTestName()"
                  :disabled="!editMode"/>
        <span class="md-error">Wymagana nazwa testu</span>
      </md-field>
      <md-switch class="md-primary" v-model="testModel.isActive" :disabled="!editMode">Aktywny</md-switch>
    </md-card>
    <md-card class="createTestCard">
      TODO: Pytania
    </md-card>
    <md-button @click="submit_click" v-if="editMode" class="md-raised md-primary confirmButton">
      Zatwierdź zmiany
    </md-button>
    <md-snackbar md-position="center" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackBarMessage}}</span>
    </md-snackbar>
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: "test-details",
    data() {
      return {
        editMode: false,
        currentUser: {},
        testModel: {},
        isTestNameValid: true,
        snackBarMessage: "Zapisano",
        showSnackbar: false,
      };
    },
    firebase: {
      redactors: firebase.database().ref("users/").orderByChild("isRedactor").equalTo(true),
    },
    mounted() {
      let currentAuthUser = firebase.auth().currentUser;
      firebase.database().ref("users/" + currentAuthUser.uid).on('value', (snapshot) => {
        let user = snapshot.val();
        user.key = snapshot.key;
        this.currentUser = user;
      });

      let testKey = this.$route.params.id;
      firebase.database().ref("tests/" + testKey).on('value', (snapshot) => {
        let test = snapshot.val();
        test.key = snapshot.key;

        let usernamePromise = firebase.database().ref('users/' + test.ownerUid + "/username").once('value');
        let positionNamePromise = firebase.database().ref('workPositions/' + test.positionUid + "/name").once('value');

        Promise.all([usernamePromise, positionNamePromise]).then(async (values) => {
          test.ownerName = values[0].val();
          test.positionName = values[1].val();
          this.testModel = test;
        });
      });
    },
    methods: {
      submit_click() {
        this.validateTestName();
        if (this.isTestNameValid) {
          firebase.database().ref("tests/" + this.testModel.key).update({
            ownerUid: this.testModel.ownerUid,
            name: this.testModel.name,
            isActive: this.testModel.isActive,
          }).then(() => {
            this.editMode = false;
            this.showSnackbar = true;
          });
        }
      },
      validateTestName() {
        this.isTestNameValid = Boolean(this.testModel.name) && Boolean(this.testModel.name.trim());
      }
    },
    computed: {
      testNameClass() {
        return {
          'md-invalid': !this.isTestNameValid
        }
      },
      canChangeOwner() {
        return this.editMode && this.currentUser.isModerator;
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

  .selectRedactors {
    margin-left: 16px;
  }
</style>
