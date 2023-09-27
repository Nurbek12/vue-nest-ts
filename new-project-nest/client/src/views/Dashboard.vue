<template>
  <v-container fluid>
    <v-row class="mt-2">
      <v-col cols="12" sm="6" md="3" v-for="(card, i) in cards" :key="i">
        <v-card
          class="mx-auto"
          height="100px"
          style="overflow: visible"
          elevation="3"
        >
          <v-sheet
            style="position: absolute; top: -10px; left: 10px"
            :color="card.color"
            height="75"
            width="75"
            rounded
            elevation="3"
            class="d-flex align-center justify-center"
          >
            <v-icon size="x-large" color="white">
              {{ card.icon }}
            </v-icon>
          </v-sheet>
          <v-card-text style="text-align: right">
            <div>{{ card.title }}</div>
            <p class="text-h4 mt-2">
              {{ info[card.item] || 0 }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <v-col
        v-for="(chart, i) in charts"
        :key="i"
        cols="12"
        :sm="chart.col"
        md="4"
      >
        <v-card
          class="mx-auto"
          height="310px"
          style="overflow: visible"
          elevation="3"
        >
          <v-sheet
            style="position: absolute; top: -10px; left: 10px; z-index: 1"
            :color="chart.color"
            height="90"
            rounded
            elevation="3"
            class="d-flex align-center justify-start pl-5 pr-6"
          >
            <v-icon size="x-large" color="white">
              {{ chart.icon }}
            </v-icon>
            <span class="ml-5 text-white">{{ chart.title }}</span>
          </v-sheet>
          <v-card-text style="transform: translateY(75px); z-index: 0">
            <component :is="chart.comp" :chart="chart" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="mb-15 mb-sm-0">
        <v-card class="mx-auto" height="calc(100% + 60px)" style="overflow: visible" elevation="3">
          <v-sheet
            style="position: absolute; top: -10px; left: 10px; z-index: 1"
            color="primary"
            height="90"
            rounded
            elevation="3"
            class="d-flex align-center justify-start pl-5 pr-6"
          >
            <v-icon size="x-large" color="white">
              mdi-wallet
            </v-icon>
            <span class="ml-5 text-white">Транзакции</span>
          </v-sheet>
          <v-card-text style="transform: translateY(75px); z-index: 0">
            <v-data-table
              v-model:items-per-page="itemsPerPage"
              :headers="headers"
              :items="desserts"
              item-value="name"
              class="elevation-0"
            >
              <template v-slot:item.no="{index}">
                {{ index+1 }}
              </template>
              <template v-slot:item.actions>
                <v-btn color="primary">
                  <v-icon class="text-white">
                    mdi-checkbook
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mx-auto" height="calc(100% + 60px)" style="overflow: visible" elevation="3">
          <TaskTable />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import Map from "../components/Map.vue"
import ChartBar from "../components/ChartBar.vue"
import ChartPie from "../components/ChartPie.vue"
import TaskTable from "../components/TaskTable.vue"
import { Ref, ref } from "vue"
import axios from "../api"

const info: Ref<any> = ref({
  clients: 0, 
  products: 0,
  orders: 0,
  profit: 0
})

const init = async () => {
  const {data} = await axios.get('/info')
  Object.assign(info.value, data)
}

init()

const cards = [
  {
    title: "Клиенты",
    color: "primary",
    item: "clients",
    icon: "mdi-account-group",
  },
  {
    title: "Продукты",
    color: "primary",
    item: "products",
    icon: "mdi-garage-variant",
  },
  {
    title: "Заказы",
    color: "primary",
    item: "orders",
    icon: "mdi-truck-cargo-container",
  },
  {
    title: "Прибыль",
    color: "primary",
    item: "profit",
    icon: "mdi-currency-usd",
  },
];
const charts = [
  {
    title: "Статистика",
    color: "primary",
    item: "users",
    icon: "mdi-chart-bar",
    col: 6,
    comp: ChartBar,
  },
  {
    title: "Статус заказов",
    color: "primary",
    item: "products",
    icon: "mdi-chart-pie",
    col: 6,
    comp: ChartPie,
  },
  {
    title: "Карта",
    color: "primary",
    item: "products",
    icon: "mdi-earth",
    col: 12,
    comp: Map,
  },
];

const itemsPerPage = ref(5);
const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Клиент", key: "name" },
  { title: "ID транзакции", key: "transactionid", sortable: false },
  { title: "Сумма", key: "amount" },
  { title: "Дата", key: "data" },
  { title: "Действия", align: "end", key: "actions", sortable: false },
];
const desserts = [
  {
    name: "Mett Margo",
    amount: 25100,
    data: '20.02.2023',
    transactionid: 123123
  },
];
</script>