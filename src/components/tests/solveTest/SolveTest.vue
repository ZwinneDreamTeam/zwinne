<template>
    <div>
      <md-card class="solveTestCard">
        <md-card-header>
          <md-card-header-text>
            <h3 class="md-title">Test: {{testName}}</h3>
          </md-card-header-text>
        </md-card-header>

        <md-field>
          <label>Wybierz język</label>
          <md-select class="mySelect" v-model="result.language" :disabled="isLanguageSelected">
            <md-option value="pl">Polski</md-option>
            <md-option value="en">Angielski</md-option>
          </md-select>
        </md-field>
      </md-card>

      <div v-if="isLanguageSelected" v-for="(question, index) in questions">
        <md-card class="solveTestCard" v-if="shouldDisplayQuestion(question)">

          <div v-if="question.type === 'text'">
            <p>{{nameForQuestionLocalized(question)}}</p>
            <md-field>
              <md-input v-model="result.answers[index]"/>
            </md-field>
          </div>

          <div v-if="question.type === 'select'">
            <p>{{nameForQuestionLocalized(question)}}</p>
            <div v-for="option in possibleAnswersLocalized(question)">
              <input type="radio" id="selectRbtn" :value=option v-model="result.answers[index]"/>
              <label for="selectRbtn">{{option}}</label>
            </div>
          </div>

          <div v-if="question.type === 'scale'">
            <p>{{nameForQuestionLocalized(question)}}</p>
            <VueSlideBar v-model="result.answers[index]" :min="parseInt(question.scaleMin)" :max="parseInt(question.scaleMax)"/>
          </div>

          <div v-if="question.type === 'number'">
            <p>{{nameForQuestionLocalized(question)}}</p>
            <md-field>
              <md-input v-model="result.answers[index]" v-on:keypress="isNumber(event)"/>
            </md-field>
          </div>

        </md-card>
      </div>
      <md-button v-if="isLanguageSelected && shouldDisplaySubmitButton" v-on:click="submitResult" class="md-raised confirmButton">Wyślij</md-button>
      <md-card v-if="isLanguageSelected && !shouldDisplaySubmitButton" class="solveTestCard">
        <h6 class="md-subhead">Brak pytań w wybranym języku</h6>
      </md-card>
    </div>
</template>

<script>
  import firebase from 'firebase';
  import VueSlideBar from 'vue-slide-bar'

  export default {
    name: "solve-test",
    data() {
      return {
        languages: [],
        questions: [],
        testName: "",
        result: {},
      };
    },
    mounted() {
      let testKey = this.$route.params.id;
      firebase.database().ref("tests/" + testKey).on('value', (snapshot) => {
        let test = snapshot.val();
        this.questions = test.questions;
        this.testName = test.name;
        this.questions.forEach((question) => {
          if (question.type === 'scale') {
            this.result.answers.push(0)
          } else {
            this.result.answers.push("")
          }
        });
      });
      let currenUserAuth = firebase.auth().currentUser;
      this.result = {
        testId: testKey,
        language: "",
        candidateId: currenUserAuth.uid,
        answers: []
      };
    },
    methods: {
      nameForQuestionLocalized(question) {
        if (this.result.language === 'pl') {
          return question.pl;
        } else if (this.result.language === 'en') {
          return question.en;
        }
      },
      possibleAnswersLocalized(question) {
        if (this.result.language === 'pl') {
          return question.possibleAnswers.pl;
        } else if (this.result.language === 'en') {
          return question.possibleAnswers.en;
        }
      },
      shouldDisplayQuestion(question) {
        if (this.result.language === 'pl') {
          return question.pl != null;
        } else if (this.result.language === 'en') {
          return question.en != null;
        }
      },
      submitResult() {
        if (!this.isResultValid()) {
          alert("Wypełnij wszystkie pola testu");
          return
        }
        firebase.database().ref("results").push(this.result).then(() => {
          alert("Test wypełniony pomyślnie");
          this.$router.push({name: 'home'})
        })
      },
      isResultValid() {
        for (let i in this.result.answers) {
          if (this.result.answers[i] == null || this.result.answers[i].length === 0) {
            return false
          }
        }
        return true
      },
      isNumber: (evt) => {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          evt.preventDefault();
        } else {
          return true;
        }
      }
    },
    computed: {
      isLanguageSelected() {
        return !(this.result.language == null) && !(this.result.language.length === 0)
      },
      shouldDisplaySubmitButton() {
        let filtered = this.questions.filter((question) => {
          return this.shouldDisplayQuestion(question)
        });
        return filtered.length !== 0;
      }
    },
    components: {
      VueSlideBar
    }
  }
</script>

<style scoped>
  .solveTestCard {
    margin: 16px;
    padding: 16px;
  }

  .confirmButton {
    background-color: #3366ff !important;
    color: #ffffff !important;
    font-size: 12px;
    width: 20vh;
    height: 6vh;
    margin: 16px;
  }
</style>

