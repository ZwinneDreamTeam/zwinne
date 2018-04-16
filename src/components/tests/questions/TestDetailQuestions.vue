<template>
  <div>
    <div class="md-table-head-label">Pytania</div>


    <section id="html-2-pdfwrapper">
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

    </section>
    <div>
      <md-button v-on:click="createPDF(questions)" class="md-raised md-primary downloadPdfButton">Pobierz PDF
      </md-button>
    </div>

    <add-question v-if="mode === 'edit'" v-on:questionSubmitted="onQuestionSubmitted"/>
  </div>
</template>

<script>
  import AddQuestion from "./AddQuestion";
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  import * as _ from "lodash";

  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    components: {AddQuestion},
    name: "test-detail-questions",
    props: ['questions', 'mode'],
    emits: ['questionAdded'],
    data() {
      return {
        margins: {
          top: 30,
          bottom: 30,
          left: 30,
          width: 550
        },

      };
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
        let objectsToReturn = [];

        let processedQuestions = _.map(questions, (value, index) => {
          switch (value.type) {
            case 'text': {
              objectsToReturn.push({text: `${index + 1}. ${value.name}`, style: 'header'});
              objectsToReturn.push({
                text: `Proszę udzielić odpowiedzi pisemnej.`,
                style: 'small',
                margin: [18, 2, 0, 150]
              });
              break;
            }

            case 'scale': {
              objectsToReturn.push({
                text: `${index + 1}. ${value.name} Odpowiedz w skali od ${value.scaleMin} do ${value.scaleMax}.`,
                style: 'header',
                margin: [0, 0, 0, 40]
              });
              break;
            }

            case 'number': {
              objectsToReturn.push({text: `${index + 1}. ${value.name}`, style: 'header'});
              objectsToReturn.push({text: `Odpowiedzią powinna być liczba.`, style: 'small', margin: [18, 2, 0, 150]});
              break;
            }

            case 'select': {
              objectsToReturn.push({text: `${index + 1}. ${value.name}`, style: 'header'});
              objectsToReturn.push({
                text: `Proszę zaznaczyć jedną z odpowiedzi.`,
                style: 'small',
                margin: [18, 2, 0, 0]
              });

              let possibleAnswers = {ul: [], margin: [15, 8, 0, 20]};
              for (let i = 0; i < value.possibleAnswers.length; i++) {
                possibleAnswers.ul.push(value.possibleAnswers[i]);
              }
              objectsToReturn.push(possibleAnswers);
              break;
            }
          }

          return objectsToReturn;
        });


        let docDefinition = {
          content: [processedQuestions],
          styles: {
            header: {
              bold: true,
              fontSize: 15
            },
            small: {
              fontSize: 7.5,
              italics: true
            }
          },
          defaultStyle: {
            fontSize: 12
          }
        };

        pdfMake.createPdf(docDefinition).download();
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
