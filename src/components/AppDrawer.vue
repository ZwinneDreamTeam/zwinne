<template>
  <md-list>
    <md-subheader>{{label_general}}</md-subheader>
    <md-list-item to="/positions">
      <md-icon>work</md-icon>
      <span class="md-list-item-text">{{label_positions}}</span>
    </md-list-item>

    <md-list-item :to="{ name: 'currentUserDetails', params: {id: uid }}">
      <md-icon>account_circle</md-icon>
      <span class="md-list-item-text"> {{label_user_profile}} </span>
    </md-list-item>

    <div v-if="isCandidate">
      <md-subheader>{{label_candidate}}</md-subheader>
      <md-list-item>
        <md-icon>error</md-icon>
        <span class="md-list-item-text">Brak pozycji</span>
      </md-list-item>
    </div>

    <div v-if="isRedactor">
      <md-subheader>{{label_redactor}}</md-subheader>
      <md-list-item>
        <md-icon>error</md-icon>
        <span class="md-list-item-text">Brak pozycji</span>
      </md-list-item>

    </div>

    <div v-if="isModerator">
      <md-subheader>{{label_moderator}}</md-subheader>
      <md-list-item to="/moderator/users">
        <md-icon>people</md-icon>
        <span class="md-list-item-text">{{label_users}}</span>
      </md-list-item>
    </div>


  </md-list>
</template>

<script>

  import firebase from 'firebase';

  export default {
    name: "app-drawer",
    data() {
      return {
        label_general: "Ogólne",
        label_candidate: "Kandydat",
        label_redactor: "Redaktor",
        label_moderator: "Moderator",
        label_positions: "Stanowiska",
        label_users: "Użytkownicy",
        label_user_profile: "Dane użytkownika",
        isModerator: false,
        isRedactor: false,
        isCandidate: false,
        uid: ""
      }
    },
    mounted() {
      console.log("mounted");
      this.uid = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/' + this.uid).on('value', (snapshot) => {
        let user = snapshot.val();
        this.isCandidate = user.isCandidate;
        this.isRedactor = user.isRedactor;
        this.isModerator = user.isModerator;
      });
    }
  }
</script>

<style scoped>



</style>
