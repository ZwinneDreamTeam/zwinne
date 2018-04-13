<template>
  <div>
    <md-card class="createTestCard">

      <md-card-header>
        <md-card-header-text>
          <h1 class="md-title">Szczegóły testu</h1>
        </md-card-header-text>
        <div v-if="currentUser.isRedactor || currentUser.isModerator">
          <md-switch class="md-primary" v-model="editMode" v-on:change="onEditModeChanged">Tryb edycji</md-switch>
        </div>
      </md-card-header>

      <md-field>
        <md-icon>person</md-icon>
        <md-select class="mySelect" v-model="testModel.ownerUid" :placeholder="testModel.ownerName"
                   :disabled="!canChangeOwnerOrPosition">
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

      <md-field>
        <md-icon>work</md-icon>
        <md-select class="mySelect" v-model="testModel.positionId" :placeholder="positionPlaceholder"
                   :disabled="!canChangeOwnerOrPosition">
          <md-option v-for="position in positions" :key="position['.key']" :value="position['.key']">
            {{position.name}}
          </md-option>
        </md-select>
      </md-field>

      <md-switch class="md-primary" v-model="testModel.isActive" :disabled="!editMode">Aktywny</md-switch>

    </md-card>

    <test-detail-questions v-bind:questions="testModel.questions" v-bind:mode="questionsMode"
                           v-bind:testId="testModel.key" v-on:questionAdded="onQuestionAdded"/>

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
  import TestDetailQuestions from "./questions/TestDetailQuestions";

  export default {
    name: "test-details",
    components: {TestDetailQuestions},
    data() {
      return {
        editMode: false,
        currentUser: {},
        originalTestModel: {},
        testModel: {},
        isTestNameValid: true,
        snackBarMessage: "Zapisano",
        showSnackbar: false,
      };
    },
    firebase: {
      redactors: firebase.database().ref("users/").orderByChild("isRedactor").equalTo(true),
      positions: firebase.database().ref("workPositions/").orderByChild("isActive").equalTo(true),
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
        let positionNamePromise = firebase.database().ref('workPositions/' + test.positionId + "/name").once('value');

        Promise.all([usernamePromise, positionNamePromise]).then(async (values) => {
          test.ownerName = values[0].val();
          test.positionName = values[1].val();
          this.testModel = test;
          this.originalTestModel = this.deepCopyTest(this.testModel);
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
            positionId: this.testModel.positionId ? this.testModel.positionId : null,
            questions: this.testModel.questions,
          }).then(() => {
            this.originalTestModel = this.deepCopyTest(this.testModel);
            this.editMode = false;
            this.showSnackbar = true;
          });
        }
      },
      onQuestionAdded(question) {
        this.testModel.questions.push(question);
      },
      validateTestName() {
        this.isTestNameValid = Boolean(this.testModel.name) && Boolean(this.testModel.name.trim());
      },
      onEditModeChanged() {
        this.testModel = this.deepCopyTest(this.originalTestModel);
      },
      deepCopyTest(test) {
        return {
          ownerUid: test.ownerUid,
          ownerName: test.ownerName,
          positionId: test.positionId,
          positionName: test.positionName,
          name: test.name,
          isActive: test.isActive,
          key: test.key,
          questions: test.questions.slice(0),
        };
      },
    },
    computed: {
      questionsMode() {
        return this.editMode ? 'edit' : 'display';
      },
      testNameClass() {
        return {
          'md-invalid': !this.isTestNameValid
        }
      },
      positionPlaceholder() {
        if (this.testModel.positionName) {
          return this.testModel.positionName;
        } else {
          return "Stanowisko";
        }
      },
      canChangeOwnerOrPosition() {
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

  .mySelect {
    margin-left: 16px;
  }
</style>
