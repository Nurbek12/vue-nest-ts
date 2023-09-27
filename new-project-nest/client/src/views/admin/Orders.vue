<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Покупки</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :search="search" :items="items"
          show-expand v-model:expanded="expanded">
          <template v-slot:top>
            <v-row class="mt-2">
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Поиск"
                  v-model="search"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.no="{index}">{{ index + 1 }}.</template>
          <template v-slot:item.date="{item}">{{ (new Date(Number(item.raw.date))).toDateString() }}</template>
          <template v-slot:item.status="{item}">
            <v-chip>{{ item.raw.status }}</v-chip>
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <!-- <span class="mt-3 mb-2 pt-2">Продукты</span> -->
                <v-card density="compact">
                  <v-card-text class="pb-0">Продукты</v-card-text>
                  <v-card-text>
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th class="text-left">
                            Но
                          </th>
                          <th class="text-left">
                            Товар
                          </th>
                          <th class="text-left">
                            Цена
                          </th>
                          <th class="text-left">
                            Количество
                          </th>
                          <th class="text-left">
                            Обшая цена
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(pr, j) in item.raw.orderProducts" :key="j">
                          <td>{{ j + 1 }}.</td>
                          <td>{{ pr.product.name }}</td>
                          <td>{{ pr.product.price }}.$</td>
                          <td>{{ pr.count }}.шт</td>
                          <td>{{ pr.product.price * pr.count }}.$</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-card-text>
                </v-card>
              </td>
            </tr>
          </template>
          <template v-slot:item.actions="{item}">
            <div class="d-flex justify-end">
              <v-btn icon="mdi-delete" variant="text" 
               size="40" color="primary" @click="deleteItem(item.raw)"></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">
          Вы уверены, что хотите удалить этот элемент?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDelete">
            Отмена
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">
            Да
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { Ref, ref, nextTick, watch } from "vue"
import { Order } from "../../interfaces"
import axios from '../../api'

const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Клиент", key: "customer.name" },
  { title: "Дата", key: "date", sortable: false },
  { title: "Обшая сумма", key: "price", sortable: false },
  { title: "Статус", key: "status", sortable: false },
  { title: "Действия", align: 'end', key: "actions", sortable: false },
];
const childheaders = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Товар", key: "product.name" },
  { title: "Цена", key: "product.price", sortable: false },
  { title: "Количество", key: "count", sortable: false },
  { title: "Обшая цена", key: "sum", sortable: false },
];
const search: Ref<string> = ref("");
const items: Ref<Order[]> = ref([]);
const dialogDelete: Ref<boolean> = ref(false);
const editedIndex: Ref<number> = ref(-1);
const editedId: Ref<number> = ref(-1);
const expanded = ref([])

watch(dialogDelete, (v)=>v||closeDelete())

const initialize = async () => {
  const { data } = await axios.get('/order')
    items.value = data
  },
  
  deleteItem = (item: Order) => {
    editedIndex.value = items.value.indexOf(item)
    editedId.value = item.id!
    dialogDelete.value = true
  },
  
  deleteItemConfirm = async () => {
    const { data } = await axios.delete(`/order/${editedId.value}`)
    if(data){
      items.value.splice(editedIndex.value, 1)
      closeDelete()
    }
  },

  closeDelete = () => {
    dialogDelete.value = false
    nextTick(() => {
      editedId.value = -1
      editedIndex.value = -1
    })
  },

  save = async () => {
    // if (editedIndex.value > -1) {
    //   Object.assign(items.value[editedIndex.value], editedItem.value)
    // } else {
    //   items.value.push(editedItem.value)
    // }
    // close()
  };

initialize()
</script>