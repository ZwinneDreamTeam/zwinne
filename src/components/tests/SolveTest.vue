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
          <md-select class="mySelect" v-model="language" :disabled="isLanguageSelected">
            <md-option value="pl">Polski</md-option>
            <md-option value="en">Angielski</md-option>
          </md-select>
        </md-field>
      </md-card>

      <div v-if="isLanguageSelected" v-for="question in questions">
        {{question.type}}
      </div>
    </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: "solve-test",
    data() {
      return {
        language: "",
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
      })
    },
    computed: {
      isLanguageSelected() {
        return !(this.language.length === 0)
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
