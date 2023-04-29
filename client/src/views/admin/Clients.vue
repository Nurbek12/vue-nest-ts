<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Пользователи</v-card-title>
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
          <template v-slot:item.image="{item}">
            <v-avatar>
              <v-img cover :src="item.raw.image?'https://adminpanel-vnps.onrender.com/'+item.raw.image:'/img/noimg.jpg'"></v-img>
            </v-avatar>
          </template>
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
                  label="Имя" hide-details
                  color="primary" variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.email"
                  label="Электронная почта" hide-details
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.phone"
                  label="Номер телефона" hide-details
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select :items="[{text:'Клиент',value:'user'},{text:'Админ',value:'user'}]"
                 v-model="editedItem.role" item-title="text" item-value="value" label="Рол"
                 variant="outlined" hide-details>
                </v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.address"
                  label="Адрес" hide-details
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4" sm="2">
                    <v-avatar size="100%">
                      <v-img cover :src="imagesrc"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="8" sm="10">
                    <v-file-input
                      v-model="image"
                      label="Фотография"
                      hide-details variant="outlined"
                      color="primary" prepend-icon="mdi-camera"
                    >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="fileName, ind in fileNames" :key="ind">
                        <v-chip color="light-blue-accent-4"
                          label size="x-small" class="me-2">
                          <span>
                            {{ fileName }}
                          </span>
                        </v-chip>
                      </template>
                    </template>
                    </v-file-input>
                  </v-col>
                </v-row>
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
import { User } from "../../interfaces/index"
import axios from '../../api'

const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Фотография", key: "image", sortable: false },
  { title: "Имя", key: "name" },
  { title: "Номер телефона", key: "phone", sortable: false },
  { title: "Электронная почта", key: "email", sortable: false },
  { title: "Адрес", key: "address", sortable: false },
  { title: "Действия", align: 'end', key: "actions", sortable: false },
];
const search: Ref<string> = ref("");
const items: Ref<User[]> = ref([]);
const dialog: Ref<boolean> = ref(false);
const dialogDelete: Ref<boolean> = ref(false);
const editedIndex: Ref<number> = ref(-1);
const editedId: Ref<number> = ref(-1);
const editedItem: Ref<User> = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  role: 'user'
} as User);
const defaultItem = {
  name: '',
  email: '',
  phone: '',
  address: '',
  role: 'user'
}
const image: Ref<File[]> = ref([])
const formTitle = computed(() => editedIndex.value === -1 ? "Добавить пользователя" : "Редактировать пользователя")
const imagesrc = computed(() => {
  if(editedItem.value?.image) return `https://adminpanel-vnps.onrender.com/${editedItem.value.image}`
  else if(image.value[0]) return URL.createObjectURL(image.value[0])
  return '/img/noimg.jpg'
})

watch(dialog, (v)=>v||close())
watch(dialogDelete, (v)=>v||closeDelete())

const initialize = async () => {
  const { data } = await axios.get('/user')
  items.value = data
  },
  editItem =  (item: User) => {
    editedIndex.value = items.value.indexOf(item)
    editedId.value = item.id!
    editedItem.value = Object.assign({}, item)
    dialog.value = true
  },

  deleteItem = (item: User) => {
    editedIndex.value= items.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedId.value = item.id!
    dialogDelete.value = true
  },

  deleteItemConfirm = async () => {
    const { data } = await axios.delete(`/user/${editedId.value}`)
    if(data){
      items.value.splice(editedIndex.value, 1)
      closeDelete()
    }
  },

  close = () => {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem as User)
      editedId.value = -1
      editedIndex.value = -1
      image.value.length = 0
    })
  },

  closeDelete = () => {
    dialogDelete.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem as User)
      editedId.value = -1
      editedIndex.value = -1
      image.value.length = 0
    })
  },

  save = async () => {
    const formdata = new FormData()
    Object.keys(editedItem.value).map((key) => {
      formdata.append(key, editedItem.value[key])
    })
    if(image.value[0]) formdata.append('image', image.value[0])
    if (editedIndex.value > -1) {
      const { data } = await axios.put(`/user/${editedId.value}`, formdata)
      Object.assign(items.value[editedIndex.value], data)
    } else {
      const { data } = await axios.post('/user', formdata)
      items.value.push(data)
    }
    close()
  };

initialize()
</script>