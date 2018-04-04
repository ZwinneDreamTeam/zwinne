<template>
  <md-card class="positionDetails">
    <h1>Position details</h1>
    <div>
      <md-field>
        <label>Name</label>
        <md-input v-model="position.name" type="text" :disabled="disabled"/>
      </md-field>
    </div>
    <div>
      <md-field>
        <label>Company</label>
        <md-input v-model="position.company" type="text" :disabled="disabled"/>
      </md-field>
    </div>
    <div>
      <md-field>
        <label>Description</label>
        <md-textarea v-model="position.description" type="text" :disabled="disabled"/>
      </md-field>
    </div>
    <div>
      <md-switch class="md-primary" v-model="position.isActive" :disabled="disabled">Active</md-switch>
    </div>
    <md-button class="md-primary md-raised" @click="disabled = false" v-if="disabled && canEdit">Edytuj</md-button>
    <md-button class="md-primary md-raised" @click="disabled = true" v-on:click="applyChanges"
               v-if="!disabled && canEdit">
      Zatwierdz
    </md-button>
  </md-card>
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
        return db.ref('/workPositions/' + this.$route.params.id).set(this.position);
      }
    },
    computed: {
      canEdit() {
        return this.isModerator || this.isRedactor;
      }
    },

    data: () => ({
      position: {},
      disabled: true,
      isModerator: false,
      isRedactor: false,
    }),
  }
</script>

<style scoped>

  .positionDetails {
    padding: 16px;
  }
</style>
