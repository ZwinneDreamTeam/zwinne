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
        <md-card class="solveTestCard">
          <div v-if="question.type === 'text'">
            <h6 class="md-subhead">{{nameForQuestion(question)}}</h6>

          </div>
          <div v-if="question.type === 'select'">
            <h6 class="md-subhead">select</h6>
          </div>
          <div v-if="question.type === 'scale'">
            <h6 class="md-subhead">scale</h6>
          </div>
          <div v-if="question.type === 'number'">
            <h6 class="md-subhead">number</h6>
          </div>
        </md-card>
      </div>
    </div>
</template>

<script>
  import firebase from 'firebase';

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
    // TODO: Add as many objects to answers array as there are questions
    // TODO: Create appropriate answer object depending on question type
    mounted() {
      let testKey = this.$route.params.id;
      firebase.database().ref("tests/" + testKey).on('value', (snapshot) => {
        let test = snapshot.val();
        this.questions = test.questions;
        this.testName = test.name;
      });
      this.result = {
        testId: testKey,
        language: "",
        candidateId: 0,
        answers: []
      }
    },
    methods: {
      nameForQuestion(question) {
        if (this.result.language === 'pl') {
          return question.pl;
        } else if (this.result.language === 'en') {
          return question.en;
        }
      }
    },
    computed: {
      isLanguageSelected() {
        return !(this.result.language == null) && !(this.result.language.length === 0)
      }
    }
  }
</script>

<style scoped>
  .solveTestCard {
    margin: 16px;
    padding: 16px;
  }
</style>

