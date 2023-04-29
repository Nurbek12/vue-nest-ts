<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Приходы/Расходы продуктов</v-card-title>
      <v-card-text>
        <v-data-table v-model:expanded="expanded" show-expand
         :headers="headers" :search="search" :items="items">
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
              <v-spacer />
              <v-col cols="12" sm="6" md="3">
                <v-btn color="primary" block
                  @click="dialog=true">Добавить</v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.no="{index}">{{ index + 1 }}.</template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <b>История: </b> 
                <v-chip v-for="(hs, i) in item.raw.history as StorageHistory[]" :key="i"
                  label size="small" class="me-2 my-1" :color="hs.status > 0 ?'green':'red'">
                    {{ hs.status > 0 ? '+' : '-' }} {{ Math.abs(hs.count) }}
                </v-chip>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="mt-2 ml-2 mb-0">
          <span class="text-h5">Приход/Расход</span>
        </v-card-title>

        <v-card-text class="px-2 pt-0">
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="editedItem.productid" item-title="name"
                  item-value="id" :items="items"
                  label="Продукт" hide-details
                  color="primary" variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="editedItem.count" type="number"
                  label="Количество" hide-details min="0"
                  color="primary" variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-switch
                  v-model="editedItem.status"
                  hide-details :true-value="1" :false-value="-1"
                  :label="editedItem.status ? 'Приход': 'Расход'"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col cols="8">
                <v-btn color="primary"
                  block @click="save" height="45">
                  Сохранить
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { Ref, ref, nextTick, watch } from "vue";
import { Product, StorageHistory } from "../../interfaces/index";
import axios from '../../api'

const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Продукт", key: "name" },
  { title: "Количество на складе", key: "quantity" },
];
const expanded: Ref<number[]> = ref([]); 
const search: Ref<string> = ref("");
const items: Ref<Product[]> = ref([]);
const dialog: Ref<boolean> = ref(false);
const editedIndex: Ref<number> = ref(-1);
const editedId: Ref<number> = ref(-1);
const editedItem: Ref<StorageHistory> = ref({
  productid: 0,
  count: 0,
  status: 1,
  add: true
});
const defaultItem = {
  productid: 0,
  count: 0,
  status: 1,
  add: true
}

watch(dialog, (v)=>v||close())
// watch(dialogDelete, (v)=>v||closeDelete())

const initialize = async () => {
  const { data } = await axios.get('/product/storage')
  items.value = data
  },

  close = () => {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedId.value = -1
      editedIndex.value = -1
    })
  },

  save = async () => {
    const index = items.value.findIndex(item => item.id === editedItem.value.productid)
    if(index<0 || items.value[index].quantity + Number(editedItem.value.status) * Number(editedItem.value.count) < 0) return
    
    const { data } = await axios.post('/product/storage', {
      ...editedItem.value,
      count: Number(editedItem.value.count)
    })
    items.value[index].quantity += Number(editedItem.value.status) * Number(editedItem.value.count)
    items.value[index].history?.push(data)
    close()
  };

initialize()
</script>