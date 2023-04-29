<template>
  <v-sheet
    style="position: absolute; top: -10px; left: 10px; z-index: 1"
    color="primary"
    height="90"
    rounded
    width="calc(100% - 20px)"
    elevation="3"
    class="d-flex align-center justify-start pl-5 pr-6"
  >
    <v-icon size="x-large" color="white"> mdi-calendar-check </v-icon>
    <span class="ml-5 text-white">Список заданий</span>
    <v-spacer />
    <v-btn icon color="white" @click="dialog = true">
      <v-icon color="primary">mdi-plus</v-icon>
    </v-btn>
  </v-sheet>
  <v-card-text style="transform: translateY(75px); z-index: 0">
    <v-data-table
      :items-per-page="5"
      :headers="taskHeader"
      :items="tasks"
      item-value="name"
      class="elevation-0"
    >
      <template v-slot:item.no="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:item.date="{item}">{{ (new Date(Number(item.raw.date))).toDateString() }}</template>
      <template v-slot:item.status="{ item }">
        <v-chip>{{ item.raw.status }}</v-chip> 
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="25" color="primary" class="me-2" @click="editItem(item.raw)">
            mdi-pencil
        </v-icon>
        <v-icon size="25" color="primary" @click="deleteItem(item.raw)">
            mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card-text>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card class="pt-4">
      <v-card-title>
        <span class="text-h5 pl-6">{{ formTitle }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                variant="outlined"
                hide-details
                color="primary"
                v-model="editedItem.title"
                label="Заголовок задачи"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.carbs"
                label="Carbs (g)"
              ></v-text-field>
            </v-col> -->
            <v-col cols="12">
              <v-textarea
                variant="outlined"
                hide-details
                color="primary"
                v-model="editedItem.description"
                label="Описание задачи"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">
          Cancel
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5"
        >Вы уверены, что хотите удалить этот элемент?</v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
          >Отмена</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
          >Да</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, computed, nextTick, watch } from "vue";
import { Task } from "../interfaces";

const taskHeader = [
  { title: "Но", align: "start", key: "no", sortable: false },
  { title: "Заголовок", key: "title", sortable: false },
  { title: "Статус", key: "status" },
  { title: "Описание", key: "description", sortable: false },
  { title: "Дата", key: "date" },
  { title: "Действия", align: "end", key: 'actions', sortable: false },
];
const tasks: Ref<Task[]> = ref( JSON.parse(localStorage.getItem('adminTasks') || '[]'));

const dialog = ref(false),
  dialogDelete = ref(false),
  editedIndex = ref(-1),
  editedItem: Ref<Task | any> = ref({
    title: "",
    date: 0,
    description: "",
    status: "new",
  }),
  defaultItem = {
    title: "",
    date: 0,
    description: "",
    status: "new",
  } as Task,
  editItem = (item: Task) => {
    editedIndex.value = tasks.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialog.value = true;
  },
  deleteItem = (item: Task) => {
    editedIndex.value = tasks.value.indexOf(item);
    editedItem.value = Object.assign({}, item);
    dialogDelete.value = true;
  },
  deleteItemConfirm = () => {
    tasks.value.splice(editedIndex.value, 1);
    closeDelete();
    localStorage.setItem('adminTasks', JSON.stringify(tasks.value))
  },
  close = () => {
    dialog.value = false;
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem);
      editedIndex.value = -1;
    });
  },
  closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
      editedItem.value = Object.assign({}, defaultItem);
      editedIndex.value = -1;
    });
  },
  save = () => {
    if(!editedItem.value.title.trim()||!editedItem.value.description.trim()) return
    if (editedIndex.value > -1) {
      Object.assign(tasks.value[editedIndex.value], editedItem.value);
    } else {
      tasks.value.push({
        ...editedItem.value,
        date: Date.now(),
        status: "new",
      } as Task);
    }
    localStorage.setItem('adminTasks', JSON.stringify(tasks.value))
    close();
  },
  formTitle = computed(() =>
    editedIndex.value === -1 ? "Создать задачу" : "Изменить задачу"
  );
  watch(dialog, (val) => val || close());
  watch(dialogDelete, (val) => val || closeDelete());
</script>