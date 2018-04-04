<template>
  <div>
    <md-card class="md-raised positionsListCard">
      <md-card-header>
        <h1 class="md-title">Add new position</h1>
      </md-card-header>

      <md-field :class="nameClass">
        <!--<md-icon>person</md-icon>-->
        <label>Name</label>
        <md-input v-model="name" type="text" v-on:keyup="validateNameIfIncorrect()" v-on:blur="validateName()"
                  required/>
        <span class="md-error">A name must contain at least 2 characters</span>
      </md-field>

      <md-field :class="companyClass">
        <!--<md-icon>company</md-icon>-->
        <label>Company</label>
        <md-input v-model="company" type="text" v-on:keyup="validateCompanyIfIncorrect()" v-on:blur="validateCompany()"
                  required/>
        <span class="md-error">A company must contain at least 2 characters</span>
      </md-field>

      <md-field :class="descriptionClass">
        <!--<md-icon>description</md-icon>-->
        <label>Description</label>
        <md-textarea v-model="description" type="text" v-on:keyup="validateDescriptionIfIncorrect()"
                  v-on:blur="validateDescription()" required/>
        <span class="md-error">A description must contain at least 2 characters</span>
      </md-field>

      <div>
        <md-switch class="md-primary" v-model="isActive">
          <label>Active</label>
        </md-switch>
      </div>

      <md-button @click="addPosition" class="md-raised md-primary" v-show="canAdd"> {{add}}</md-button>
    </md-card>
  </div>
</template>

<script>
  import firebase from 'firebase'

  let db = firebase.database();

  export default {
    name: "position-add",
    firebase: {
      users: db.ref('users')
    },
    data: () => ({
      name: "",
      company: "",
      description: "",
      isActive: false,
      add: "Add",
      validName: true,
      validCompany: true,
      validDescription: true
    }),
    methods: {
      addPosition: function () {
        if (this.isValid()) {
          let positionData = {
            company: this.$data.company,
            description: this.$data.description,
            isActive: this.$data.isActive,
            name: this.$data.name
          };
          db.ref('/workPositions/' + firebase.database().ref('workPositions').push().key).set(positionData);
          this.$data.name = "";
          this.$data.company = "";
          this.$data.description = "";
          this.$data.isActive = false;
        }
      },
      isValid: function () {
        let nameValid = this.validateName();
        let companyValid = this.validateCompany();
        let descriptionValid = this.validateDescription();
        return nameValid && companyValid && descriptionValid;
      },
      validateName: function () {
        this.$data.validName = this.$data.name.length >= 2;
        return this.$data.validName;
      },
      validateNameIfIncorrect: function () {
        if (this.$data.validName) return;
        this.validateName();
      },
      validateCompany: function () {
        this.$data.validCompany = this.$data.company.length >= 2;
        return this.$data.validCompany;
      },
      validateCompanyIfIncorrect: function () {
        if (this.$data.validCompany) return;
        this.validateCompany();
      },
      validateDescription: function () {
        this.$data.validDescription = this.$data.description.length >= 2;
        return this.$data.validDescription;
      },
      validateDescriptionIfIncorrect: function () {
        if (this.$data.validDescription) return;
        this.validateDescription();
      }
    },
    computed: {
      canAdd: function () {
        let currentUserAuth = firebase.auth().currentUser;
        let currentUser = this.users.filter((user) => {
          return user['.key'] === currentUserAuth.uid
        });
        if (currentUser[0] == null) {
          return false
        }
        return (currentUser[0].isModerator || currentUser[0].isRedactor)
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
      },
    },

  }
</script>

<style scoped>

  .positionsListCard {
    padding: 10px;
  }

</style>
