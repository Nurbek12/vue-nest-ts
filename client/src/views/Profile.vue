<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="mx-auto">
          <v-card-title>Настройки Авы</v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-avatar rounded size="100%">
                  <v-img :src="imagesrc" cover></v-img>
                </v-avatar>
              </v-col>
              <v-col cols="6">
                <v-file-input v-show="false" id="avatarfile" @change="uploadAvatar"></v-file-input>
                <v-btn height="100%" block color="primary" @click="pressFile">
                  <v-icon size="30">mdi-camera</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-subtitle>Настройки пароля</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="Новый пароль" v-model="pass1"
                  hide-details :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  color="primary" :type="show1 ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock-outline" @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="Данный пароль" v-model="pass2"
                  hide-details :type="show1 ? 'text' : 'password'"
                  color="primary"
                  prepend-inner-icon="mdi-lock-check-outline"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row class="px-2 pb-2">
              <v-col cols="12">
                <v-btn color="primary" @click="changePass" variant="elevated" block>Изменить Пароля</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8">
        <v-card>
          <v-card-title>Настройки аккаунта</v-card-title>
          <v-card-text class="mt-2">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  label="Имя" v-model="details.name"
                  hide-details
                  color="primary"
                  prepend-inner-icon="mdi-account-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  label="Электронная почта"
                  hide-details v-model="details.email"
                  color="primary"
                  prepend-inner-icon="mdi-at"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  label="Номер телефона"
                  hide-details v-model="details.phone"
                  color="primary"
                  prepend-inner-icon="mdi-phone-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  label="Адрес"
                  hide-details v-model="details.address"
                  color="primary"
                  prepend-inner-icon="mdi-map-marker-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-btn block color="primary" @click="updateProfile" height="45"> Submit </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, Ref, ref } from "vue"
import { User } from "../interfaces";
import store from '../store'
import axios from '../api'

const { user, changeUser } = store()
const details: Ref<User> = ref({...user} as User)
const pass1 = ref('')
const pass2 = ref('')
const image: Ref<File[]> = ref([])

const imagesrc = computed(() => {
  if(image.value[0]) return URL.createObjectURL(image.value[0])
  else if(details.value.image) return `https://adminpanel-vnps.onrender.com/${details.value.image}`
  else return '/img/noimg.jpg'
})

const pressFile = () => document.getElementById('avatarfile')?.click()

const updateProfile = async () => {
  const { data } = await axios.put(`/user/${details.value.id}`, details.value)
  Object.assign(details.value, data)
  changeUser(data)
}

const changePass = async () => {
  if(!pass1.value.trim() || !pass2.value.trim()) return
  const { data } = await axios.put('/user/edit/pass', { 
    newpassword: pass1.value,
    password: pass2.value
  })
  if(!data) return
  changeUser({...user, password: pass1.value}),

  pass1.value = ''
  pass2.value = ''
}

const uploadAvatar = async (e: any) => {
  const fomrdata = new FormData()
  fomrdata.append('image', e.target.files[0])
  const { data } = await axios.put(`/user/${details.value.id}`, fomrdata)
  Object.assign(details.value, data)
  changeUser(data)
}

const show1 = ref(false)
</script>