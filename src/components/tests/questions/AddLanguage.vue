<template>
  <md-card class="languageCard">
    <h3>Inna wersja językowa</h3>
    <md-field>
      <md-icon>list</md-icon>
      <label>Język pytania</label>
      <md-select class="languageSelect" v-model="language">
        <md-option value="pl">Polski</md-option>
        <md-option value="en">Angielski</md-option>
      </md-select>
    </md-field>
    <md-field :class="questionNameClass">
      <md-icon>help</md-icon>
      <label>Treść pytania</label>
      <md-input v-if="language === 'pl'" v-model="questionModel.pl" required v-on:blur="validateQuestionName()"
                v-on:keyup="validateQuestionName()"/>
      <md-input v-if="language === 'en'" v-model="questionModel.en" required v-on:blur="validateQuestionName()"
                v-on:keyup="validateQuestionName()"/>
      <span class="md-error">Wymagana treść pytania</span>
    </md-field>

    <div class="questionDetails">

      <div v-if="questionModel.type === 'select'">
        <md-list v-if="language==='pl'">
          <md-list-item v-for="(answer, id) in questionModel.possibleAnswers.en" :key="id">
            <md-field>
              <md-input v-model="possibleAnswers.pl[id]" type="text" required/>
            </md-field>
          </md-list-item>
        </md-list>
        <md-list v-else-if="language==='en'">
          <md-list-item v-for="(answer, id) in questionModel.possibleAnswers.pl" :key="id">
            <md-field>
              <md-input v-model="possibleAnswers.en[id]" type="text" required/>
            </md-field>
          </md-list-item>
        </md-list>
      </div>

    </div>

    <md-button v-on:click="addLanguage" class="md-primary">Dodaj</md-button>
  </md-card>
</template>

<script>
  import firebase from 'firebase';

  let db = firebase.database();
  var questionRef;

  export default {
    name: "add-language",
    props: ['questionID', 'questions'],
    emits: ['languageSubmitted'],
    data() {
      return {
        newPossibleAnswer: "",
        isQuestionNameValid: true,
        isQuestionDetailsValid: true,
        isNewPossibleAnswerValid: true,
        newPossibleAnswerErrorMessage: "",
        language: "en",
        questionModel: {},
        possibleAnswers: {
          pl: [],
          en: []
        }
      };
    },
    mounted() {
      let question = this.questions[this.questionID];
      this.questionModel = question;

      if (question.type === 'select') {
        if (question.possibleAnswers.pl) {
          this.possibleAnswers.pl = question.possibleAnswers.pl;
        } else if (question.possibleAnswers.en) {
          this.possibleAnswers.en = question.possibleAnswers.en;
        }
      }
    },
    methods: {
      addLanguage() {
        this.validateQuestionName();
        this.validateQuestionDetails();
        if (this.isQuestionNameValid && this.isQuestionDetailsValid) {
          this.questionModel.possibleAnswers = this.possibleAnswers;
          this.$emit('languageSubmitted', this.questionModel, this.questionID);
        }
      },
      validateQuestionName() {
        if (this.language === "pl") {
          this.isQuestionNameValid = Boolean(this.questionModel.pl) && Boolean(this.questionModel.pl.trim());
        } else if (this.language === "en") {
          this.isQuestionNameValid = Boolean(this.questionModel.en) && Boolean(this.questionModel.en.trim());
        }
      },
      validateQuestionDetails() {
        if (this.questionModel.type === 'text' || this.questionModel.type === 'number') {
          this.isQuestionDetailsValid = true;
        } else if (this.questionModel.type === 'select') {
          if (this.language === 'pl') {
            this.isQuestionDetailsValid = this.possibleAnswers.pl.length > 1;
          } else if (this.language === 'en') {
            this.isQuestionDetailsValid = this.possibleAnswers.en.length > 1;
          }
          if (!this.isQuestionDetailsValid) {
            this.newPossibleAnswerErrorMessage = "Wymagane minimum 2 odpowiedzi";
          }
        }
      },
      validateNewPossibleAnswer() {
        this.isNewPossibleAnswerValid = this.newPossibleAnswer.length > 0;
        if (!this.isNewPossibleAnswerValid) {
          this.newPossibleAnswerErrorMessage = "Odpowiedź nie może być pusta";
        }
      }
    },
    computed: {
      questionNameClass() {
        return {
          'better-code-hub-field': 'not-important',
          'md-invalid': !this.isQuestionNameValid
        }
      },
      questionDetailsClass() {
        return {
          'better-code-hub-field': 'not-important',
          'md-invalid': !this.isQuestionDetailsValid
        }
      },
      newPossibleAnswerClass() {
        return {
          'better-code-hub-field': 'not-important',
          'md-invalid': !(this.isNewPossibleAnswerValid && this.isQuestionDetailsValid)
        }
      },
    }
  }
</script>

<style scoped>
  .languageCard {
    margin: 16px;
  }

  .languageSelect {
    margin-left: 16px;
  }

  .questionDetails {
    overflow: auto;
  }

</style>
