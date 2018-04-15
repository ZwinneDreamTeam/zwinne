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

    <div>
      <md-button v-on:click="createPDF(questions)" class="md-raised md-primary downloadPdfButton">Pobierz PDF
      </md-button>
    </div>

    <add-question v-if="mode === 'edit'" v-on:questionSubmitted="onQuestionSubmitted"/>
  </div>
</template>

<script>
  import AddQuestion from "./AddQuestion";
  import jsPDF from "jsPDF";

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
      },
      createPDF(questions) {
        const doc = new jsPDF();
        let height = 0;
        for (let i = 0; i < this.questions.length; i++) {
          doc.setFontSize(12);
          height += 10;

          doc.text((i + 1).toString() + ". " + questions[i].name, 10, height + 10);

          height += 6;
          doc.setFontSize(10);

          switch (questions[i].type) {
            case 'text':
              doc.setLineWidth(5);
              doc.text('Pytanie otwarte', 10, height + 10);
              break;
            case 'scale':
              doc.text('Pytanie skali (' + questions[i].scaleMin + ' - ' + questions[i].scaleMax + ')', 10, height + 10);
              break;
            case 'number':
              doc.text('Pytanie liczbowe', 10, height + 10);
              break;
            case 'select':
              let text = 'Pytanie wyboru: ';
              for (let j = 0; j < this.questions[i].possibleAnswers.length; j++) {
                if (j === 0) {
                  text += questions[i].possibleAnswers[j];
                } else {
                  text += ", " + questions[i].possibleAnswers[j];
                }
              }
              doc.text(text, 10, height + 10);
              break;
          }

          height += 5;
        }

        doc.save('test.pdf');
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

  .downloadPdfButton {
    margin-left: 16px;
  }

  .questionType {
    font-size: 12px;
    color: grey;
  }
</style>
