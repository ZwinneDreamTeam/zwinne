<template>
  <div>
    <h3>Pytania</h3>

    <md-field>
      <md-icon>list</md-icon>
      <label>Pokaż pytania w języku:</label>
      <md-select class="mySelect" v-model="language">
        <md-option value="all">Wszystkie</md-option>
        <md-option value="pl">Polski</md-option>
        <md-option value="en">Angielski</md-option>
      </md-select>
    </md-field>

    <div v-for="(question, id) in questions" :key="id">
      <h4>Pytanie {{id+1}}</h4>
      <md-button class="md-primary" v-if="mode === 'edit'" @click="addLanguage(id)">Dodaj wersję językową</md-button>
      <div v-if="(language==='en' || language==='all') && question.en">
        <md-card class="questionCard">
          <span class="questionName">{{question.en}}</span>
          <div class="questionType">{{questionType(question.type)}}
            <span v-if="question.type === 'scale'">({{question.scaleMin}} - {{question.scaleMax}})</span>
            <span v-else-if="question.type === 'select'">
              <span v-for="(answer, index) in question.possibleAnswers.en">
                <span v-if="index === 0">: </span>
                <span v-else>, </span>
                {{answer}}</span>
            </span>
          </div>
        </md-card>
      </div>
      <div v-if="(language==='pl' || language==='all') && question.pl">
        <md-card class="questionCard">
          <span class="questionName">{{question.pl}}</span>
          <div class="questionType">{{questionType(question.type)}}
            <span v-if="question.type === 'scale'">({{question.scaleMin}} - {{question.scaleMax}})</span>
            <span v-else-if="question.type === 'select'">
              <span v-for="(answer, index) in question.possibleAnswers.pl">
                <span v-if="index === 0">: </span>
                <span v-else>, </span>
                {{answer}}</span>
            </span>
          </div>
        </md-card>
      </div>
      <add-language questionID="id" v-if="addLanguageToTest===id" v-on:languageSubmitted="onLanguageAdded"
          v-bind:questionID=addLanguageToTest />
    </div>

    <add-question v-if="mode === 'edit'" v-on:questionSubmitted="onQuestionSubmitted"/>
  </div>
</template>

<script>
  import AddQuestion from "./AddQuestion";
  import AddLanguage from "./AddLanguage";

  export default {
    components: {AddQuestion, AddLanguage},
    name: "test-detail-questions",
    props: ['testId', 'questions', 'mode'],
    emits: ['questionAdded', 'questionID', 'languageAdded'],
    data() {
      return {
        language: "all",
        addLanguageToTest: -1
      };
    },
    methods: {
      addLanguage(id) {
        this.addLanguageToTest = id;
      },
      onLanguageAdded(model, id) {
        this.addLanguageToTest = -1;
        this.$emit('languageAdded', model, id)
      },
      onQuestionSubmitted(question) {
        this.$emit('questionAdded', question);
      },
      questionType(type) {
        switch (type) {
          case 'text':
            return 'Pytanie otwarte';
          case 'scale':
            return 'Pytanie skali';
          case 'number':
            return 'Pytanie liczbowe';
          case 'select':
            return 'Pytanie wyboru';
        }
      }
    },
  }
</script>

<style scoped>
  .questionCard {
    margin: 16px;
    padding: 16px;
  }

  .questionName {
    font-size: 16px;
  }

  .questionType {
    font-size: 12px;
    color: grey;
  }

  .questionLanguage {
    font-size: 12px;
    color: black;
  }

  .mySelect {
    margin-left: 16px;
  }

  .md-primary {
    margin-left: 0px;
  }
</style>
