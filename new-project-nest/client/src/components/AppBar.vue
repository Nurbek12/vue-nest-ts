<template>
  <v-app-bar density="compact" height="80" elevation="1">
    <v-app-bar-title>Администрация магазина</v-app-bar-title>

    <template v-slot:append>
      <v-btn :icon="themeIcon" @click="changeTheme"></v-btn>
      <v-btn class="ml-1" icon="mdi-account">
        <v-avatar>
          <v-img :src="imagesrc" cover></v-img>
        </v-avatar>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import vuetify from "../plugins/vuetify"
import { computed } from "vue"
import store from '../store'
import { User } from "../interfaces"

const { logout, user } = store()
const signout = () => {
  logout()
  location.href = '/login'
}

const imagesrc = computed(() => {
  if((user as User).image) 
    return `https://adminpanel-vnps.onrender.com/${(user as User).image}`
  else
    return '/img/noimg.jpg'
})

const changeTheme = () => {
  vuetify.theme.global.name.value =
  vuetify.theme.global.name.value === "dark" ? "light" : "dark";
  localStorage.setItem('theme', vuetify.theme.name.value)
}

const themeIcon = computed(() => {
    return vuetify.theme.global.name.value === "dark" ? "mdi-weather-night" : "mdi-white-balance-sunny";
})
</script>

<style>
</style>