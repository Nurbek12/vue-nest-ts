<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Категории</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :search="search" :items="items">
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
                  @click="dialog=true">Создать</v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.no="{index}">{{ index + 1 }}.</template>
          <template v-slot:item.actions="{item}">
            <div class="d-flex justify-end">
              <v-btn icon="mdi-pencil" variant="text" 
               size="40" color="primary" @click="editItem(item.raw)"></v-btn>
              <v-btn icon="mdi-delete" variant="text" 
               size="40" color="primary" @click="deleteItem(item.raw)"></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="mt-2 ml-2 mb-0">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text class="px-2 pt-0">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Название" hide-details
                  color="primary" variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Описание" hide-details
                  color="primary"
                  variant="outlined"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
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
import { Ref, ref, computed, nextTick, watch } from "vue"
import { Category } from "../../interfaces/index"
import axios from '../../api'

const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Название", key: "name" },
  { title: "Описание", key: "description", sortable: false },
  { title: "Действия", align: 'end', key: "actions", sortable: false },
];
const search: Ref<string> = ref("");
const items: Ref<Category[]> = ref([]);
const dialog: Ref<boolean> = ref(false);
const dialogDelete: Ref<boolean> = ref(false);
const editedIndex: Ref<number> = ref(-1);
const editedId: Ref<number> = ref(-1);
const editedItem: Ref<Category> = ref({
  name: '',
  description: ''
});
const defaultItem = {
  name: '',
  description: '',
}
const formTitle = computed(() => editedIndex.value === -1 ? "Добавить Категорию" : "Редактировать Категорию")

watch(dialog, (v)=>v||close())
watch(dialogDelete, (v)=>v||closeDelete())

const initialize = async () => {
  const { data } = await axios.get('/category')
  items.value = data
  },
  editItem =  (item: Category) => {
    editedIndex.value = items.value.indexOf(item)
    editedId.value = item._id!
    editedItem.value = Object.assign({}, item)
    dialog.value = true
  },

  deleteItem = (item: Category) => {
    editedIndex.value= items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedId.value = item._id!
    dialogDelete.value = true
  },

  deleteItemConfirm = async () => {
    const { data } = await axios.delete(`/category/${editedId.value}`)
    if(data){
      items.value.splice(editedIndex.value, 1)
      closeDelete()
    }
  },

  close = () => {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedId.value = -1
      editedIndex.value = -1
    })
  },

  closeDelete = () => {
    dialogDelete.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedId.value = -1
      editedIndex.value = -1
    })
  },

  save = async () => {
    if (editedIndex.value > -1) {
      const { data } = await axios.put(`/category/${editedId.value}`, editedItem.value)
      Object.assign(items.value[editedIndex.value], data)
    } else {
      const { data } = await axios.post('/category', editedItem.value)
      items.value.push(data)
    }
    close()
  };

initialize()
</script>