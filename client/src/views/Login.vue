<template>
  <v-container fluid>
    <v-card class="mx-auto" max-width="500">
    <v-card-title class="pt-3">
        Вход в систему
    </v-card-title>
    <v-card-text v-if="error && step == 2" class="text-red py-2">{{ error }}</v-card-text>

    <v-window v-model="step">
        <v-window-item :value="1">
            <v-card-text class="pt-3">
                <v-form fast-fail @submit.prevent="register">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                            variant="outlined"
                            color="primary"
                            hide-details
                            label="Имя" :rules="rules"
                            v-model="name"
                            prepend-inner-icon="mdi-account-outline"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                            variant="outlined"
                            color="primary"
                            hide-details :rules="rules"
                            label="Электронная почта"
                            v-model="email"
                            prepend-inner-icon="mdi-at"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                            variant="outlined"
                            v-model="password"
                            hide-details
                            label="Пароль" :rules="rules"
                            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            color="primary"
                            :type="show ? 'text' : 'password'"
                            prepend-inner-icon="mdi-lock-outline"
                            @click:append="show = !show"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-btn variant="elevated"
                                color="primary" height="45"
                                block type="submit">
                                Создать Аккоунт
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-window-item>

        <v-window-item :value="2">
            <v-card-text class="pt-3">
                <v-form fast-fail @submit.prevent="login">
                    <v-row>
                    <v-col cols="12">
                        <v-text-field
                        variant="outlined"
                        color="primary"
                        hide-details :rules="rules"
                        label="Логин"
                        v-model="email"
                        prepend-inner-icon="mdi-account-outline"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                        variant="outlined"
                        v-model="password"
                        hide-details :rules="rules"
                        label="Пароль"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        color="primary"
                        :type="show ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-outline"
                        @click:append="show = !show"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-btn variant="elevated"
                        color="primary"
                        height="45"
                        block type="submit"
                        >Войти</v-btn>
                    </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions class="px-4">
        <v-btn v-if="step > 1" variant="text" @click="step--">Регистратция</v-btn>
        <v-btn v-else variant="flat" @click="step++">Вход</v-btn>
        <v-spacer></v-spacer>
        <v-switch v-if="step==1"
            v-model="role"
            hide-details :true-value="'admin'" :false-value="'user'"
            :label="role === 'admin' ? 'Суперадмин': 'Пользователь'"
            color="primary"
        ></v-switch>
    </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue"
import store from '../store'
import api, { refreshRequest } from '../api'

const { changeUser, changeToken } = store()
const email = ref("")
const name = ref("")
const password = ref("")
const role = ref("user")
const step = ref(1)
const show = ref(false)
const error = ref('')
const rules = [(v: string) => !!v || 'Пополните это поле!']
const close = () => {
    name.value = ''
    email.value = ''
    password.value = ''
    show.value = false
    error.value = ''
}
const login = async () => {
  if (!email.value.trim() || !password.value.trim()) return
  try {
    const { data } = await api.post("/auth/login", {
        email: email.value,
        password: password.value,
    });
    if(data.token){
        changeToken(data.token)
        changeUser(data.user)
        refreshRequest()
        location.href = '/'
    }
  } catch (_) {
    error.value = 'Логин или пароль неверный!'
  }
};
const register = async () => {
  if (!email.value.trim() || !password.value.trim() || !name.value.trim()) return
  const { data } = await api.post("/auth/signup", {
    email: email.value,
    password: password.value,
    name: name.value,
    role: role.value,
  })
  if(data){
    step.value = 2
    console.log(data)
    close()
  }
}
</script>

<style>
</style>