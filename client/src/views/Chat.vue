<template>
  <v-container fluid style="height: 100%;" class="pb-1 pt-2">
    <v-row justify="center">
      <v-col cols="12" sm="10" class="px-0">
        <!-- <v-card rounded="0"> -->
          <div class="chatbox">
              <v-sheet width="100%" class="px-3 py-2 d-flex item-center">
                <div class="ml-2 text-h5 mt-2">Чат</div>
              </v-sheet>
              <div class="d-flex flex-column-reverse justify-start"
                style="overflow: auto">
                <div>
                    <div v-for="(message, j) in messages" :key="j"
                      class="d-flex px-2" style="width: 100%;"
                      :class="my(message.sender.id) ? 'justify-end' : 'justify-start'">
                      <v-avatar v-if="!my(message.sender.id)" class="mt-1 mr-2" style="position: sticky; top: 0;">
                        <v-img :src="message.sender.image?message.sender.image:'/img/noimg.jpg'" alt="" />
                      </v-avatar>
                      <v-sheet :color="!my(message.sender.id) ? 'surface' : 'info'"
                        :border="!my(message.sender.id) && 'md'"
                        max-width="300"
                        class="px-2" style="margin: 2px 0; padding-top: 2px;"
                        elevation="0" rounded
                      >
                        <b class="text-caption text-primary font-weight-bold" v-if="!my(message.sender.id)">{{ message.sender.name }}<br></b>
                        <span class="text-body-2">{{ message.text }}</span>
                        <p style="float: right" class="mt-2 ml-2">
                          <span class="text-caption text-grey-lighten-2">
                            {{
                              new Date(Number(message.date)).toString().slice(16, 21)
                            }}
                          </span>
                        </p>
                      </v-sheet>
                    </div>
                </div>
              </div>
              <v-sheet width="100%" class="d-flex item-center py-3">
                <div class="d-flex items-center px-1"
                  style="width: 100%; gap: 5px;">
                  <!-- <v-btn flat variant="plain" size="40">
                    <v-icon>mdi-emoticon-outline</v-icon>
                  </v-btn> -->
                  <v-text-field
                    clearable
                    label="Сообшения"
                    v-model="text"
                    type="text"
                    density="compact"
                    variant="outlined"
                    hide-details @keypress.enter="send"
                  >
                  </v-text-field>
                  <v-btn @click="send"
                    flat size="40"
                    variant="plain"
                    :disabled="!text?.trim()">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                </div>
              </v-sheet>
          </div>
        <!-- </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script lang="ts" setup>
import { ref, Ref } from "vue"
import store from "../store"
import axios from '../api'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001/')

const { user } = store()
const text = ref("");
const messages: Ref<any> = ref([])

function my(id: string) {
  return (user as any).id === id;
}

async function init(){
  const { data } = await axios.get('/chat')
  // console.log(data);
  messages.value = data
}

init()

socket.on('chat', (data) => {
  messages.value.push(data)
})

async function send(){
  const message = {
    text: text.value,
    senderid: (user as any).id,
    date: Date.now()
  }
  const { data } = await axios.post('/chat', message)
  socket.emit('send', data)
  text.value = ''
}
</script>

<style>
.chatbox{
  position: relative;
  display: grid;
  height: 100%;
  grid-template-rows: 64px auto 58px;
  max-height: 580px;
  /* background: rgb(var(--v-theme-surface)); */
  border: 2px solid rgb(var(--v-theme-surface));
  box-shadow: 0 0 2px #0003;
}
</style>