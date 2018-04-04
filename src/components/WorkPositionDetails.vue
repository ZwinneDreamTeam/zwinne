<template>
  <div>
    <h1>Position details</h1>
    <div>
     <md-field>
       <label>Name</label>
       <md-input v-model="name" type="text" :disabled="disabled"/>
     </md-field>
    </div>
    <div>
     <md-field>
       <label>Company</label>
       <md-input v-model="company" type="text" :disabled="disabled"/>
     </md-field>
    </div>
    <div>
      <md-field>
       <label>Description</label>
       <md-textarea v-model="description" type="text" :disabled="disabled"/>
     </md-field>
    </div>
    <div>
      <md-switch class="md-primary" v-model="isActive" :disabled="disabled">Active</md-switch>
    </div>
    <md-button @click="disabled = !disabled" class="md-primary" v-show="disabled && canEdit"> {{edit}}</md-button>
    <md-button @click="disabled = !disabled" v-on:click="applyChanges" class="md-primary" v-show="!disabled && canEdit"> {{apply}}</md-button>
  </div>
</template>

<script>
import { db } from "../App"
import firebase from 'firebase'

let usersRef = db.ref('users');

export default {
    name: "position-details",
    firebase: {
      users: usersRef
    },
    methods: {
      getPosition: function () {
        var position
        var key = this.$route.params.id
         let positionDb = db.ref('/workPositions/' + key)
         positionDb.on('value', function (snapshot) {
           position = snapshot.val();
           window.sessionStorage.setItem("name", position.name);
           window.sessionStorage.setItem("company", position.company);
           window.sessionStorage.setItem("description", position.description);
           window.sessionStorage.setItem("isActive", position.isActive);
         });

        this.name = window.sessionStorage.getItem("name");
        this.company = window.sessionStorage.getItem("company");
        this.description = window.sessionStorage.getItem("description");
        this.isActive = window.sessionStorage.getItem("isActive") === "true";
      },
      applyChanges: function() {
        var positionData = {
          company: this.$data.company,
          description: this.$data.description,
          isActive: this.$data.isActive,
          name: this.$data.name
        };

        return db.ref('/workPositions/' + this.$route.params.id).set(positionData);
      }
    },
    computed: {
      canEdit: function () {
        let currentUserAuth = firebase.auth().currentUser;
        let currentUser = this.users.filter((user) => {
          return user['.key'] === currentUserAuth.uid
        });
        if (currentUser[0] == null) {
          return false
        }
        return (currentUser[0].isModerator || currentUser[0].isRedactor)
      }
    },
    beforeMount(){
      this.getPosition();
    },
    data: () => ({
        name: "",
        company: "",
        description: "",
        isActive: false,
        edit: "Edit",
        apply: "Apply",
        disabled: true
    }),
  }
</script>

<style scoped>

</style>
