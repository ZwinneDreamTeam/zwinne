<template>
    <md-card class="questionCard">
      <md-card-content>
        <h3>Nowe pytanie</h3>
        <md-field>
          <md-icon>help</md-icon>
          <label>Treść pytania</label>
          <md-input v-model="questionModel.name" required/>
        </md-field>
        <md-field>
          <md-icon>list</md-icon>
          <label>Rodzaj pytania</label>
          <md-select class="mySelect" v-model="questionModel.type">
            <md-option value="text">Otwarte</md-option>
            <md-option value="select">Wyboru</md-option>
            <md-option value="scale">Skali</md-option>
            <md-option value="number">Liczbowe</md-option>
          </md-select>
        </md-field>

        <div class="questionDetails">
          <div v-if="questionModel.type === 'scale'">
            <div class="splitWidth">
              <md-field>
                <md-icon>vertical_align_bottom</md-icon>
                <label>Min</label>
                <md-input type="number" v-model="questionModel.scaleMin"/>
              </md-field>
            </div>
            <div class="splitWidth maxInput">
              <md-field>
                <md-icon>vertical_align_top</md-icon>
                <label>Max</label>
                <md-input type="number" v-model="questionModel.scaleMax"/>
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
            <md-field>
              <md-icon>add</md-icon>
              <label>Dodaj odpowiedź</label>
              <md-input v-model="newPossibleAnswer"/>
              <md-button class="md-icon-button" v-on:click="addPossibleAnswer()">
                <md-icon class="md-primary">send</md-icon>
              </md-button>
            </md-field>
          </div>
        </div>


        <md-button @click="submit_click" class="md-raised md-primary">
          Dodaj pytanie
        </md-button>
      </md-card-content>
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
        questionModel: {
          possibleAnswers: [],
        },
      };
    },
    methods: {
      submit_click() {
        this.$emit('questionSubmitted', this.questionModel);
        this.questionModel = {
          possibleAnswers: [],
        };
      },
      addPossibleAnswer() {
        this.questionModel.possibleAnswers.push(this.newPossibleAnswer);
        this.newPossibleAnswer = "";
      },
      deletePossibleAnswer(answer) {
        let index = this.questionModel.possibleAnswers.indexOf(answer);
        if (index > -1) {
          this.questionModel.possibleAnswers.splice(index, 1);
        }
      },
    },
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
    overflow: hidden;
  }

  .maxInput {
    margin-left: 16px;
  }
</style>
