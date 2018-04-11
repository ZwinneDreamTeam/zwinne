<template>
  <div>
    <div class="md-table-head-label">Pytania</div>

    <md-card v-for="question in questions" :key="question.name" class="questionCard">
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
    props: ['questions', 'mode'],
    emits: ['questionAdded'],
    data() {
      return {};
    },
    methods: {
      onQuestionSubmitted(question) {
        this.$emit('questionAdded', question);
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
