<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Покупки</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :search="search"
          :items="items"
          show-expand
          v-model:expanded="expanded"
        >
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
                <v-btn color="primary" block @click="dialog = true"
                  >Создать</v-btn
                >
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.no="{ index }">{{ index + 1 }}.</template>
          <template v-slot:item.date="{ item }">{{
            new Date(Number(item.raw.date)).toDateString()
          }}</template>
          <template v-slot:item.status="{ item }">
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
                          <th class="text-left">Но</th>
                          <th class="text-left">Товар</th>
                          <th class="text-left">Цена</th>
                          <th class="text-left">Количество</th>
                          <th class="text-left">Обшая цена</th>
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
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end">
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="40"
                color="primary"
                @click="deleteItem(item.raw)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="mt-2 ml-2 mb-0">
          <span class="text-h5">Добавить заказ ({{ total }}) $</span>
        </v-card-title>

        <v-card-text class="px-2 pt-0">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.address"
                  label="Адрес"
                  hide-details
                  color="primary"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-row class="px-3 my-1" v-for="(pr, i) in productList" :key="i">
                <v-col cols="6">
                    <v-select @update:modelValue="(e:any) => change(e, i)" v-model="pr.productid"
                        label="Товар" :items="products"
                        item-title="name" item-value="id"
                        hide-details
                        color="primary"
                        variant="outlined"
                    ></v-select>
                </v-col>
                <v-col cols="4">
                    <v-text-field
                        v-model="pr.count"
                        label="Количество" min="0"
                        hide-details type="number"
                        color="primary" @input="summTotal"
                        variant="outlined"
                    ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-btn icon @click="removeProduct(i)">
                    <v-icon color="red">mdi-close</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-col cols="12">
                <v-btn color="primary" block @click="addProduct" height="45">
                  Добавить товар
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" block @click="save" height="45">
                  Заказать
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
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="deleteItemConfirm"
          >
            Да
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
  
  <script lang="ts" setup>
import { Ref, ref, nextTick, watch, computed } from "vue";
import { Order, Product, ProductList } from "../interfaces";
import axios from "../api";
import store from "../store";

const { user } = store();
const headers = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Клиент", key: "customer.name" },
  { title: "Дата", key: "date", sortable: false },
  { title: "Обшая сумма", key: "price", sortable: false },
  { title: "Статус", key: "status", sortable: false },
  { title: "Действия", align: "end", key: "actions", sortable: false },
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
const products: Ref<Product[]> = ref([]);
const productList: Ref<ProductList[]> = ref([]);
const dialogDelete: Ref<boolean> = ref(false);
const editedIndex: Ref<number> = ref(-1);
const editedId: Ref<number> = ref(-1);
const expanded = ref([]);
const dialog = ref(false);
const editedItem: Ref<Order> = ref({
  address: '',
  clientid: (user as any).id,
  date: Date.now(),
  status: 'new'
} as Order);
const defaultItem = {
  address: '',
  status: 'new'
};

const total = ref(0);
watch(dialogDelete, (v) => v || closeDelete());

const initialize = async () => {
    const [{ data }, product] = await Promise.all([
        axios.get(`/order?id=${(user as any).id}`),
        axios.get('/product/'),
    ]);
    items.value = data;
    products.value = product.data
  },
  deleteItem = (item: Order) => {
    editedIndex.value = items.value.indexOf(item);
    editedId.value = item.id!;
    dialogDelete.value = true;
  },
  deleteItemConfirm = async () => {
    const { data } = await axios.delete(`/order/${editedId.value}`);
    if (data) {
      items.value.splice(editedIndex.value, 1);
      closeDelete();
    }
  },
  close = () => {
    dialog.value = false
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem as Order)
      editedId.value = -1
      editedIndex.value = -1
    })
  },
  closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
      editedId.value = -1;
      editedIndex.value = -1;
    });
  },
  addProduct = () => {
    productList.value.push({
        price: 0,
        productid: 0,
        count: 0
    })
  },
  change = (item: any, i: number) => {
    summTotal()
    productList.value[i].price = products.value.find(p => p.id === item)?.price!
  },
  summTotal = () => {
    total.value = productList.value.reduce((sum, { price, count }) => {
      return sum + Number(count || 0) * Number(price || 0)
    }, 0)
  },
  removeProduct = (i: number) => productList.value.splice(i, 1),
  save = async () => {
    if(!editedItem.value.address.trim()) return
    
    const { data } = await axios.post('/order', {
        ...editedItem.value,
        orderProducts: productList.value
    })
    console.log(data);
    
    items.value.push(data)
    close()
  };

initialize();
</script>