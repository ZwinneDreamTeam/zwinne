<template>
    <div>
      <md-card class="markTestCard">
        <md-card-header>
          <md-card-header-text>
            <h3 class="md-title">Oceń test</h3>
          </md-card-header-text>
        </md-card-header>
      </md-card>

      <div v-for="(question, index) in questions">
        <md-card class="markTestCard" v-if="shouldDisplayQuestion(question)">
            <p>{{nameForQuestionLocalized(question)}}</p>
            <md-field>
              <label>Odpowiedź:</label>
              <md-input v-model="result.answers[index].answer" type="text" :disabled=true />
            </md-field>
            <md-field>
                <div v-if="question.type === 'text' || question.type === 'scale' || question.type === 'number'">
                  <md-select placeholder="Ocena" type="number"  v-model="result.answers[index].mark" required>
                    <label>Ocena: </label>
                    <md-option value=0 >0</md-option>
                    <md-option value=0.25 >0.25</md-option>
                    <md-option value=0.5 >0.5</md-option>
                    <md-option value=0.75 >0.75</md-option>
                    <md-option value=1 >1</md-option>
                  </md-select>
                </div>
                <div v-if="question.type === 'select'">
                   <md-select placeholder="Ocena" type="number" v-model="result.answers[index].mark" required>
                    <md-option value=0 >0</md-option>
                    <md-option value=1 >1</md-option>
                  </md-select>
                </div>
            </md-field>
        </md-card>
      </div>
      <md-button v-on:click="markTest" class="md-raised confirmButton">Zakończ ocenianie</md-button>
    </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: "solve-test",
    data() {
      return {
        questions: [],
        result: [],
      };
    },
    mounted() {
      let key = this.$route.params.id;
      firebase.database().ref("results/" + key).on('value', (snapshot) => {
        this.result = snapshot.val();
        firebase.database().ref("tests/" + snapshot.val().testId).on('value', (snapshot) => {
          let test = snapshot.val();
           this.questions = test.questions;
        });
      });
    },
    methods: {
      nameForQuestionLocalized(question) {
        return question[this.result.language];
      },
      shouldDisplayQuestion(question) {
        return question[this.result.language] != null && question[this.result.language] !== '';
      },
      markTest() {
        if (!this.isResultValid()) {
          alert("Oceń wszystkie pytania");
          return
        }
        for (let i in this.result.answers) {
          this.result.answers[i].mark = Number(this.result.answers[i].mark);
        }
        firebase.database().ref("results/" + this.$route.params.id).set(this.result).then(() => {
          alert("Test został oceniony");
          this.$router.push({name: 'resolvedTests'})
        })
      },
      isResultValid() {
        for (let i in this.result.answers) {
          if (!this.result.answers[i].mark) {
            return false
          }
        }
        return true
      },
    },
    computed: {
      shouldDisplaySubmitButton() {
        let filtered = this.questions.filter((question) => {
          return this.shouldDisplayQuestion(question)
        });
        return filtered.length !== 0;
      }
    },
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
  .markTestCard {
    padding : 10px;
    margin-top: 15px
  }
</style>

