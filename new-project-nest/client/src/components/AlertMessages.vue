<template>
  <v-snackbar
      :timeout="3000" @input="changeAlert({}, false)"
      :color="alert_status"
      variant="tonal">
      {{ alert_text }}
      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="changeAlert({}, false)"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import store from '../store'

const { alert_show, alert_status, alert_text } = storeToRefs(store())
const { changeAlert } = store()
</script>

<style>
</style>