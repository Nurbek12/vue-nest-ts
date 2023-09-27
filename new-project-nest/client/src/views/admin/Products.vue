<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Продукты</v-card-title>
      <v-card-text>
        <v-data-table v-model:expanded="expanded" show-expand
        :headers="headers" :search="search" :items="products">
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
            <v-avatar rounded>
              <v-img cover :src="item.raw.images?.length!==0?'https://adminpanel-vnps.onrender.com/'+item.raw.images[0]:'/img/nophoto.jpg'"></v-img>
            </v-avatar>
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="d-flex">
              <v-btn icon="mdi-pencil" variant="text" 
               size="40" color="primary" @click="editItem(item.raw)"></v-btn>
              <v-btn icon="mdi-delete" variant="text" 
               size="40" color="primary" @click="deleteItem(item.raw)"></v-btn>
            </div>
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                <b>Описание продукта - </b> {{ item.raw.description }}
              </td>
            </tr>
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
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Название" hide-details
                  color="primary" variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.quantity"
                  label="Количество на складе" type="number" 
                  hide-details variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field
                  v-model="editedItem.price"
                  label="Цена" type="number" 
                  hide-details variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="8">
                <v-select
                  v-model="editedItem.categoryid" :items="categories"
                  label="Категория" item-title="name"
                  hide-details item-value="id"
                  variant="outlined" color="primary"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="4" sm="2">
                    <v-avatar rounded size="100%">
                      <v-img cover :src="image"></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="8" sm="10">
                    <v-file-input
                      v-model="images"
                      label="Фотография" multiple counter 
                      hide-details variant="outlined"
                      color="primary" prepend-icon="mdi-camera"
                    >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="(fileName, index) in fileNames as string[]" :key="fileName">
                        <v-chip v-if="index < 2" color="amber-accent-4"
                          label size="x-small" class="me-2">
                          <span style="max-width: 50px;">
                            {{ fileName }}
                          </span>
                        </v-chip>

                        <span v-else-if="index === 2"
                          class="text-caption mx-2">
                          +{{ images.length - 2 }} File(s)
                        </span>
                      </template>
                    </template>
                    </v-file-input>
                  </v-col>
                </v-row>
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
import { Product } from "../../interfaces"
import axios from '../../api'

const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Фотография", key: "image", sortable: false },
  { title: "Название", key: "name" },
  { title: "Цена", key: "price" },
  { title: "Количество на складе", key: "quantity" },
  { title: "Категория", key: "category.name" },
  { title: "Действия", align: "end", key: "actions", sortable: false },
];
const search: Ref<string> = ref("");
const products: Ref<Product[]> = ref([]);
const categories: Ref<Product[]> = ref([]);
const dialog: Ref<boolean> = ref(false);
const dialogDelete: Ref<boolean> = ref(false);
const editedIndex: Ref<number> = ref(-1);
const editedId: Ref<number> = ref(-1);
const images: Ref<File[]> = ref([])
const expanded: Ref<number[]> = ref([]); 
const editedItem: Ref<Product> = ref({
  name: '',
  description: '',
  categoryid: 0,
  price: 0,
  quantity: 0,
  images: [],
});
const defaultItem = {
  name: '',
  description: '',
  categoryid: 0,
  price: 0,
  quantity: 0,
  images: [],
}
const formTitle = computed(() => editedIndex.value === -1 ? "Добавить Товар" : "Редактировать Товар")
const image = computed(() => {
  if(images.value.length > 0) return URL.createObjectURL(images.value[0])
  return '/img/nophoto.jpg'
})
const valid = computed(() => {
  Object.keys(editedItem.value).map((key: any) => {
    return String(editedItem.value[key]) === ''
  }).includes(true)
})

watch(dialog, (v)=>v||close())
watch(dialogDelete, (v)=>v||closeDelete())

const initialize = async () => {
    const data = await Promise.all([axios.get('/product'), axios.get('/category')])
    products.value = data[0].data
    categories.value = data[1].data
  },
  editItem =  (item: Product) => {
    editedIndex.value = products.value.indexOf(item)
    editedId.value = item.id!
    editedItem.value = Object.assign({}, item)
    dialog.value = true
  },

  deleteItem = (item: Product) => {
    editedIndex.value= products.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
    editedId.value = item.id!
    dialogDelete.value = true
  },

  deleteItemConfirm = async () => {
    const { data } = await axios.delete(`/product/${editedId.value}`)
    if(data){
      products.value.splice(editedIndex.value, 1)
      closeDelete()
    }
  },

  close = () => {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedId.value = -1
      images.value.length = 0
      editedIndex.value = -1
    })
  },

  closeDelete = () => {
    dialogDelete.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem)
      editedId.value = -1
      images.value.length = 0
      editedIndex.value = -1
    })
  },

  save = async () => {
    const formdata = new FormData()
    Object.keys(editedItem.value).map((key) => {
      formdata.append(key, editedItem.value[key])
    })
    formdata.delete('images')
    images.value.map(image => {
      formdata.append('image', image)
    })
    if (editedIndex.value > -1) {
      const { data } = await axios.put(`/product/${editedId.value}`, formdata)
      console.log(data);
      
      Object.assign(products.value[editedIndex.value], data)
    } else {
      const { data } = await axios.post('/product', formdata)
      products.value.push(data)
    }
    close()
  };

initialize()
</script>