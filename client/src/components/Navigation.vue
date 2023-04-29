<template>
  <v-navigation-drawer v-model="drawer" :rail="rail"
    permanent width="250" app :expand-on-hover="mobile">
    <v-divider></v-divider>
    <v-list :lines="false" nav mandatory>
      <v-list-item v-for="(item, i) in items" link :to="item.url"
        :key="i" :value="item" active-color="primary">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-list>

    <v-btn position="absolute" v-if="!mobile" :icon="`mdi-chevron-${!rail?'left':'right'}`" size="x-small"
      @click="rail = !rail" style="right: -15px;"></v-btn>
    <template v-slot:append>
      <v-list :lines="false" nav>
        <v-list-item @click="signout" link active-color="primary">
        <template v-slot:prepend>
          <v-icon>mdi-logout-variant</v-icon>
        </template>

        <v-list-item-title>Выйти</v-list-item-title>
      </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, Ref, watch } from "vue"
import store from '../store'
import { useDisplay } from 'vuetify'

const mobile = useDisplay().mobile

watch(mobile, () => {
  if(mobile) rail.value = true
})

const { logout, user } = store()
const drawer: Ref<boolean> = ref(true);
const rail: Ref<boolean> = ref(true);
const items = (user as any).role === 'admin' ? [
  { title: "Главная", icon: "mdi-home", url: "/" },
  { title: "Товары", icon: "mdi-package-variant", url: "/products" },
  { title: "Категории", icon: "mdi-chart-arc", url: "/categoies" },
  { title: "Склад", icon: "mdi-warehouse", url: "/storage" },
  { title: "Заказы", icon: "mdi-cart-variant", url: "/orders" },
  { title: "Пользователи", icon: "mdi-account-group", url: "/clients" },
  { title: "Обсуждения", icon: "mdi-forum", url: "/chat" },
  { title: "Профиль", icon: "mdi-account-cog", url: "/profile" },
] : [
  { title: "Заказы", icon: "mdi-cart-variant", url: "/myorders" },
  { title: "Обсуждения", icon: "mdi-forum", url: "/chat" },
  { title: "Профиль", icon: "mdi-account-cog", url: "/profile" },
];
  
const signout = () => {
  logout()
  location.href = '/login'
}
</script>
