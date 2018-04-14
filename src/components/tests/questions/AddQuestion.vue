<template>
  <md-card class="questionCard">
    <h3>Nowe pytanie</h3>
    <md-field>
      <md-icon>list</md-icon>
      <label>Język pytania</label>
      <md-select class="mySelect" v-model="language">
        <md-option value="pl">Polski</md-option>
        <md-option value="en">Angielski</md-option>
      </md-select>
    </md-field>
      <div v-if="language === 'pl'">
        <md-field :class="questionNameClass">
          <md-icon>help</md-icon>
          <label>Treść pytania</label>
          <md-input v-model="questionModel.pl" required v-on:blur="validateQuestionName()"
                    v-on:keyup="validateQuestionName()"/>
          <span class="md-error">Wymagana treść pytania</span>
        </md-field>
      </div>
      <div v-else-if="language === 'en'">
        <md-field :class="questionNameClass">
          <md-icon>help</md-icon>
          <label>Treść pytania</label>
          <md-input v-model="questionModel.en" required v-on:blur="validateQuestionName()"
                    v-on:keyup="validateQuestionName()"/>
          <span class="md-error">Wymagana treść pytania</span>
        </md-field>
      </div>
    <md-field>
      <md-icon>list</md-icon>
      <label>Rodzaj pytania</label>
      <md-select class="mySelect" v-model="questionModel.type" required>
        <md-option value="text">Otwarte</md-option>
        <md-option value="select">Wyboru</md-option>
        <md-option value="scale">Skali</md-option>
        <md-option value="number">Liczbowe</md-option>
      </md-select>
    </md-field>

    <div class="questionDetails">

      <div v-if="questionModel.type === 'scale'">
        <div class="splitWidth">
          <md-field :class="questionDetailsClass">
            <md-icon>vertical_align_bottom</md-icon>
            <label>Min</label>
            <md-input type="number" v-model="questionModel.scaleMin" required v-on:blur="validateQuestionDetails()"
                      v-on:keyup="validateQuestionDetails()"/>
          </md-field>
        </div>
        <div class="splitWidth maxInput">
          <md-field :class="questionDetailsClass">
            <md-icon>vertical_align_top</md-icon>
            <label>Max</label>
            <md-input type="number" v-model="questionModel.scaleMax" required v-on:blur="validateQuestionDetails()"
                      v-on:keyup="validateQuestionDetails()"/>
          </md-field>
        </div>
      </div>

      <div v-else-if="questionModel.type === 'select'">
        <md-list>
          <md-list-item v-for="answer in questionModel.possibleAnswers" :key="answer">
            <span>{{answer}}</span>
            <md-button class="md-icon-button md-list-action" v-on:click="deletePossibleAnswer(answer)">
              <md-icon class="md-primary">delete</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
        <md-field :class="newPossibleAnswerClass">
          <label>Dodaj odpowiedź</label>
          <md-input v-model="newPossibleAnswer" required v-on:blur="validateNewPossibleAnswer()"
                    v-on:keyup="validateNewPossibleAnswer()"/>
          <span class="md-error">{{newPossibleAnswerErrorMessage}}</span>
          <md-button class="md-icon-button" v-on:click="addPossibleAnswer()">
            <md-icon class="md-primary">send</md-icon>
          </md-button>
        </md-field>
      </div>

    </div>


    <md-button v-on:click="addQuestion" class="md-primary">
      Dodaj pytanie
    </md-button>
  </md-card>
</template>

<script>

  export default {
    name: "add-question",
    props: ['testId'],
    emits: ['questionSubmitted'],
    data() {
      return {
        newPossibleAnswer: "",
        isQuestionNameValid: true,
        isQuestionDetailsValid: true,
        isNewPossibleAnswerValid: true,
        newPossibleAnswerErrorMessage: "",
        language: "pl",
        questionModel: {
          pl: "",
          en: "",
          type: "text",
          possibleAnswers: {
            pl: [],
            en: []
          },
        },
      };
    },
    methods: {
      addQuestion() {
        this.validateQuestionName();
        this.validateQuestionDetails();
        if (this.isQuestionNameValid && this.isQuestionDetailsValid) {
          this.$emit('questionSubmitted', this.questionModel);
          this.questionModel = {
            pl: "",
            en: "",
            type: "text",
            possibleAnswers: {
              pl: [],
              en: []
            },
          };
        }
      },
      addPossibleAnswer() {
        this.validateNewPossibleAnswer();
        if (this.isNewPossibleAnswerValid) {
          this.questionModel.possibleAnswers['.'+language].push(this.newPossibleAnswer);
          this.newPossibleAnswer = "";
          if (!this.isQuestionDetailsValid) {
            this.validateQuestionDetails();
          }
        }
      },
      deletePossibleAnswer(answer) {
        let index = this.questionModel.possibleAnswers.indexOf(answer);
        if (index > -1) {
          this.questionModel.possibleAnswers.splice(index, 1);
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
        } else if (this.questionModel.type === 'scale') {
          this.isQuestionDetailsValid =
            !isNaN(this.questionModel.scaleMin) &&
            !isNaN(this.questionModel.scaleMax) &&
            parseInt(this.questionModel.scaleMin) < parseInt(this.questionModel.scaleMax);
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
