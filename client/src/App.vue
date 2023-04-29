<template>
  <v-app>
    <Navigation v-if="logined" />
    <AppBar v-if="logined" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <AlertMessages /> -->
  </v-app>
</template>

<script setup lang="ts">
import Navigation from "./components/Navigation.vue"
import AppBar from "./components/AppBar.vue"
// import AlertMessages from "./components/AlertMessages.vue"
import store from './store/index'
import { computed } from 'vue'

const logined = computed(() => store().logged)
</script>

<style>
* {
  font-family: "Open Sans", sans-serif;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>