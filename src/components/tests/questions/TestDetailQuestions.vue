<template>
  <div>
    <div class="md-table-head-label">Pytania</div>

    <md-card v-for="question in questions" class="questionCard">
      {{question.name}}
      {{question.type}}
    </md-card>

    <add-question v-if="mode === 'edit'" v-on:questionSubmitted="onQuestionSubmitted"/>
  </div>
</template>

<script>
  import AddQuestion from "./AddQuestion";

  export default {
    components: {AddQuestion},
    name: "test-detail-questions",
    props: ['questions', 'mode', 'testId'],
    emits: ['questionSubmitted'],
    data() {
      return {};
    },
    methods: {
      onQuestionSubmitted(question) {
        console.log(question);
        this.$emit('questionSubmitted', question);
      }
    }
  }
</script>

<style scoped>
  .questionCard {
    margin: 16px;
    padding: 16px;
  }
</style>
