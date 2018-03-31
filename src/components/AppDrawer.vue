<template>
  <md-list>

    <md-subheader>{{label_general}}</md-subheader>
    <md-list-item>
      <md-icon>error</md-icon>
      <span class="md-list-item-text">Spam</span>
    </md-list-item>

    <md-subheader>{{label_candidate}}</md-subheader>
    <md-list-item>
      <md-icon>move_to_inbox</md-icon>
      <span class="md-list-item-text">Inbox</span>
    </md-list-item>

    <md-subheader>{{label_recruiter}}</md-subheader>
    <md-list-item>
      <md-icon>send</md-icon>
      <span class="md-list-item-text">Sent Mail</span>
    </md-list-item>

    <md-subheader>{{label_moderator}}</md-subheader>
    <md-list-item>
      <md-icon>delete</md-icon>
      <span class="md-list-item-text">Trash</span>
    </md-list-item>


  </md-list>
</template>

<script>
  export default {
    name: "app-drawer",
    data() {
      return {
        label_general: "Ogólne",
        label_candidate: "Kandydat",
        label_recruiter: "Rekruter",
        label_moderator: "Moderator",
      }
    }
  }
</script>

<style scoped>

</style>
