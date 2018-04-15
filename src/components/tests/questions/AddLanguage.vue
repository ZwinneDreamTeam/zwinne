<template>
  <md-card class="questionCard">
    <h3>Inna wersja językowa</h3>
    <md-field>
      <md-icon>list</md-icon>
      <label>Język pytania</label>
      <md-select class="mySelect" v-model="language">
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
      <md-list v-if="language === 'pl'">
        <md-list-item v-for="(answer, id) in questionModel.possibleAnswers.pl" :key="answer">
          <md-input v-model="questionModel.possibleAnswers.pl['.'+id]" required v-on:blur="validateNewPossibleAnswer()"
                          v-on:keyup="validateNewPossibleAnswer()"/>
        </md-list-item>
      </md-list>
      <md-list v-if="language === 'en'">
        <md-list-item v-for="(answer, id) in questionModel.possibleAnswers.en" :key="answer">
          <md-input v-model="questionModel.possibleAnswers.en['.'+id]" required v-on:blur="validateNewPossibleAnswer()"
                          v-on:keyup="validateNewPossibleAnswer()"/>
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
    props: ['questionID'],
    emits: ['languageSubmitted'],
    data() {
      return {
        newPossibleAnswer: "",
        isQuestionNameValid: true,
        isQuestionDetailsValid: true,
        isNewPossibleAnswerValid: true,
        newPossibleAnswerErrorMessage: "",
        language: "pl",
        questionModel: {},
      };
    },
    mounted() {
      let testID = this.$route.params.id;
      this.questionRef = db.ref('/tests/' + testID + '/questions/' + this.questionID);
      this.questionRef.on('value', (snapshot) => {
        this.questionModel = snapshot.val();
      });
    },
    methods: {
      addLanguage() {
        this.validateQuestionName();
        this.validateQuestionDetails();
        if (this.isQuestionNameValid && this.isQuestionDetailsValid) {
          this.questionRef.set(this.questionModel);
          this.$emit('languageSubmitted');
        }
      },
      validateQuestionName() {
        if(this.language === "pl") {
          this.isQuestionNameValid = Boolean(this.questionModel.pl) && Boolean(this.questionModel.pl.trim());
        } else if(this.language === "en") {
          this.isQuestionNameValid = Boolean(this.questionModel.en) && Boolean(this.questionModel.en.trim());
        }
      },
      validateQuestionDetails() {
        if (this.questionModel.type === 'text' || this.questionModel.type === 'number') {
          this.isQuestionDetailsValid = true;
        } else if (this.questionModel.type === 'select') {
          this.isQuestionDetailsValid = this.questionModel.possibleAnswers.length > 1;
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
          'md-invalid': !this.isQuestionNameValid
        }
      },
      questionDetailsClass() {
        return {
          'md-invalid': !this.isQuestionDetailsValid
        }
      },
      newPossibleAnswerClass() {
        return {
          'md-invalid': !this.isNewPossibleAnswerValid || !this.isQuestionDetailsValid
        }
      },
    }
  }
</script>

<style scoped>
  .questionCard {
    margin: 16px;
  }

  .mySelect {
    margin-left: 16px;
  }

  .splitWidth {
    float: left;
    width: 100px;
  }

  .questionDetails {
    overflow: auto;
  }

  .maxInput {
    margin-left: 16px;
  }

</style>
