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
                    v-bind:questionID=addLanguageToTest v-bind:questions=questions></add-language>
    </div>
    <md-button v-if="language !== 'all'" v-on:click="createPDF(questions, language)"
               class="md-raised md-primary downloadPdfButton">Pobierz PDF
    </md-button>
    <add-question v-if="mode === 'edit'" v-on:questionSubmitted="onQuestionSubmitted"/>
  </div>
</template>

<script>
  import AddQuestion from "./AddQuestion";
  import pdfMake from "pdfmake/build/pdfmake";
  import pdfFonts from "pdfmake/build/vfs_fonts";
  import * as _ from "lodash";

  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  import AddLanguage from "./AddLanguage";

  export default {
    components: {AddQuestion, AddLanguage},
    name: "test-detail-questions",
    props: ['testId', 'questions', 'mode', 'testName', 'redactorName'],
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
      },
      createPDF(questions, language) {
        let objectsToReturn = [];
        objectsToReturn.push({text: this.testName, style: 'fileName',});
        objectsToReturn.push({
          text: this.redactorName,
          style: 'subheader',
          margin: [0, 0, 0, 30],
          alignment: 'center'
        });

        let processedQuestions = _.map(questions, (value, index) => {
          switch (value.type) {
            case 'text': {

              switch (language) {
                case 'pl': {
                  objectsToReturn.push({text: `${index + 1}. ${value.pl}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Proszę udzielić odpowiedzi pisemnej.`,
                    style: 'small',
                    margin: [18, 2, 0, 150]
                  });
                  break;
                }

                case 'en': {
                  objectsToReturn.push({text: `${index + 1}. ${value.en}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Please provide a written answer.`,
                    style: 'small',
                    margin: [18, 2, 0, 150]
                  });
                  break;
                }
              }
              break;
            }

            case 'scale': {

              switch (language) {
                case 'pl': {
                  objectsToReturn.push({text: `${index + 1}. ${value.pl}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Odpowiedz w skali od ${value.scaleMin} do ${value.scaleMax}.`,
                    style: 'small',
                    margin: [18, 2, 0, 40]
                  });
                  break;
                }

                case 'en': {
                  objectsToReturn.push({text: `${index + 1}. ${value.en}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Please answer on a scale of ${value.scaleMin} to ${value.scaleMax}.`,
                    style: 'small',
                    margin: [18, 2, 0, 40]
                  });
                  break;
                }
              }
              break;
            }

            case 'number': {

              switch (language) {
                case 'pl': {
                  objectsToReturn.push({text: `${index + 1}. ${value.pl}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Odpowiedzią powinna być liczba.`,
                    style: 'small',
                    margin: [18, 2, 0, 150]
                  });
                  break;
                }

                case 'en': {
                  objectsToReturn.push({text: `${index + 1}. ${value.en}`, style: 'header'});
                  objectsToReturn.push({
                    text: `The answer should be a number.`,
                    style: 'small',
                    margin: [18, 2, 0, 150]
                  });
                  break;
                }
              }
              break;
            }

            case 'select': {

              switch (language) {
                case 'pl': {
                  objectsToReturn.push({text: `${index + 1}. ${value.pl}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Proszę zaznaczyć jedną z odpowiedzi.`,
                    style: 'small',
                    margin: [18, 2, 0, 0]
                  });

                  let possibleAnswers = {ul: [], margin: [15, 8, 0, 20]};
                  for (let i = 0; i < value.possibleAnswers.pl.length; i++) {
                    possibleAnswers.ul.push({text: value.possibleAnswers.pl[i], listType: 'square'});
                  }
                  objectsToReturn.push(possibleAnswers);
                  break;
                }

                case  'en': {
                  objectsToReturn.push({text: `${index + 1}. ${value.en}`, style: 'header'});
                  objectsToReturn.push({
                    text: `Please mark one of the answers.`,
                    style: 'small',
                    margin: [18, 2, 0, 0]
                  });

                  let possibleAnswers = {ul: [], margin: [15, 8, 0, 20]};
                  for (let i = 0; i < value.possibleAnswers.en.length; i++) {
                    possibleAnswers.ul.push({text: value.possibleAnswers.en[i], listType: 'square'});
                  }
                  objectsToReturn.push(possibleAnswers);
                  break;
                }
              }
              break;
            }
          }
          return objectsToReturn;
        });


        let docDefinition = {
          content: [processedQuestions],
          pageMargins: [50, 50],
          styles: {
            fileName: {
              bold: true,
              fontSize: 25,
              margin: [0, 0, 0, 5],
              alignment: 'center'
            },
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
