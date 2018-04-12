<template>
  <div>
    <div class="md-table-head-label">Pytania</div>

    <md-card v-for="question in questions" :key="question.name" class="questionCard">
      <span class="questionName">{{question.name}}</span>
      <div class="questionType">{{questionType(question.type)}}
        <span v-if="question.type === 'scale'">({{question.scaleMin}} - {{question.scaleMax}})</span>
        <span v-else-if="question.type === 'select'">
          <span v-for="(answer, index) in question.possibleAnswers">
            <span v-if="index === 0">: </span>
            <span v-else>, </span>
            {{answer}}</span>
        </span>
      </div>
    </md-card>

    <add-question v-if="mode === 'edit'" v-on:questionSubmitted="onQuestionSubmitted"/>
  </div>
</template>

<script>
  import AddQuestion from "./AddQuestion";

  export default {
    components: {AddQuestion},
    name: "test-detail-questions",
    props: ['questions', 'mode'],
    emits: ['questionAdded'],
    data() {
      return {};
    },
    methods: {
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
</style>
