<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2">
          <v-card-title>Статистика товаров</v-card-title>
          <v-card-text>
            <div class="chart">
              <div class="chart-labels">
                <p v-for="i in 10" :key="i">{{ i*10 }}</p>
              </div>
              <div class="char-bars">
                <div class="bar" v-for="({ count, status }, index) in productStatistic" :key="index" 
                :style="{ height: (Math.abs(count)>100?Math.abs(count/100):Math.abs(count)*1.5) + '%', background: status>0?'#FFCA28':'#ff0ff0' }"></div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4"></v-col>
    </v-row>
  </v-container>
</template>
  
<script lang="ts" setup>
import axios from '../../api'
import { ref } from 'vue'

const productStatistic = ref([])

const init = async () => {
  const { data } = await axios.get('/product/statistic')
  console.log(data);
  productStatistic.value = data
}

init()
</script>

<style>
.chart {
  margin-top: 5px;
  position: relative;
  display: grid;
  grid-template-columns: 25px auto;
  gap: 10px;
  height: 200px;
  width: 100%;
}

.char-bars{
  width: 100%;
  gap: 2%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}

.bar {
  width: calc(100% / 20);
  /* background-color: rgba(var(--v-theme-primary)); */
  background: #FFCA28;
  /* background: #fff; */
  transition: height 0.5s ease-in-out;
}
.chart-labels{
  left: 0;
  display: flex;
  text-align: right;
  font-size: 12px;
  height: 100%;
  flex-direction: column-reverse;
}
</style>