<template>
<div>
  <md-card class="positionDetails">
      <md-card-header>
        <h1 class="md-title">Szczegóły stanowiska</h1>
      </md-card-header>

      <md-field :class="nameClass">
        <label>Nazwa stanowiska</label>
        <md-input v-model="position.name" type="text" :disabled="disabled"
              v-on:keyup="validateNameIfIncorrect()" v-on:blur="validateName()" required/>
        <span class="md-error">Nazwa stanowiska musi zawierać co najmniej 2 znaki</span>
      </md-field>

      <md-field :class="companyClass">
        <label>Nazwa firmy</label>
        <md-input v-model="position.company" type="text" :disabled="disabled"
            v-on:keyup="validateCompanyIfIncorrect()" v-on:blur="validateCompany()" required/>
        <span class="md-error">Nazwa firmy musi zawierać co najmniej 2 znaki</span>
      </md-field>

      <md-field :class="descriptionClass">
        <label>Opis stanowiska</label>
        <md-textarea v-model="position.description" type="text" :disabled="disabled"
            v-on:keyup="validateDescriptionIfIncorrect()" v-on:blur="validateDescription()" required/>
        <span class="md-error">Opis stanowiska musi zawierać co najmniej 2 znaki</span>
      </md-field>

    <div>
      <md-switch class="md-primary" v-model="position.isActive" :disabled="disabled">Aktywne</md-switch>
    </div>

    <md-button class="md-primary md-raised" @click="disabled = false" v-if="disabled && canEdit">Edytuj</md-button>
    <md-button class="md-primary md-raised" @click="disabled = true" v-on:click="applyChanges"
               v-if="!disabled && canEdit">
      Zapisz
    </md-button>
  </md-card>
  </div>
</template>

<script>
  import firebase from 'firebase'

  let db = firebase.database();

  export default {
    name: "position-details",
    mounted() {
      var key = this.$route.params.id;
      db.ref('workPositions/' + key).on('value', snapshot => {
        this.position = snapshot.val();
      });
      db.ref('users/' + firebase.auth().currentUser.uid).on('value', snapshot => {
        this.isModerator = snapshot.val().isModerator;
        this.isRedactor = snapshot.val().isRedactor;
      });
    },
    methods: {
      applyChanges() {
      if(this.isValid()) {
          return db.ref('/workPositions/' + this.$route.params.id).set(this.position);
        }
      },
      isValid: function () {
        let nameValid = this.validateName();
        let companyValid = this.validateCompany();
        let descriptionValid = this.validateDescription();
        return nameValid && companyValid && descriptionValid;
      },
      validateName: function () {
        this.$data.validName = this.position.name.length >= 2;
        return this.$data.validName;
      },
      validateNameIfIncorrect: function () {
        if (this.$data.validName) return;
        this.validateName();
      },
      validateCompany: function () {
        this.$data.validCompany = this.position.company.length >= 2;
        return this.$data.validCompany;
      },
      validateCompanyIfIncorrect: function () {
        if (this.$data.validCompany) return;
        this.validateCompany();
      },
      validateDescription: function () {
        this.$data.validDescription = this.position.description.length >= 2;
        return this.$data.validDescription;
      },
      validateDescriptionIfIncorrect: function () {
        if (this.$data.validDescription) return;
        this.validateDescription();
      }
    },
    computed: {
      canEdit() {
        return this.isModerator || this.isRedactor;
      },
      nameClass() {
        return {
          'md-invalid': !this.validName
        }
      },
      companyClass() {
        return {
          'md-invalid': !this.validCompany
        }
      },
      descriptionClass() {
        return {
          'md-invalid': !this.validDescription
        }
      }
    },

    data: () => ({
      position: {},
      disabled: true,
      isModerator: false,
      isRedactor: false,
      validName: true,
      validCompany: true,
      validDescription: true
    }),
  }
</script>

<style scoped>

  .positionDetails {
    padding: 16px;
  }
</style>
