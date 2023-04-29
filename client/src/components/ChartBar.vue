<template>
   <v-container fluid class="pa-0">
    <div class="chart">
      <div class="chart-labels">
        <p v-for="i in 10" :key="i">{{ i*10 }}</p>
      </div>
      <div class="char-bars">
        <div class="bar" v-for="(value, index) in chartdata" 
          :key="index" :style="{ height: value.count + '%', background: value.status>0?'#FFCA28':'blue' }"></div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import axios from './../api'

const chartdata: Ref<any[]> = ref([])
async function createRandomChart() {
  const { data } = await axios.get('/product/statistic')
  chartdata.value = data
}

createRandomChart()
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
  width: calc(100% / 12);
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
<!-- <style>
.chart-container {
  position: relative;
  height: 210px;
  margin: 0 5px;
}

.chart-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(50%);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  font-size: 12px;
  font-weight: bold;
  color: #999999;
}

.chart-labels div {
  width: calc(100% / 10);
  text-align: center;
}

.chart {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 20px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: transparent;
  overflow: hidden;
}

.chart-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  height: 100%;
  width: 100%;
  background-color: transparent;
  transition: transform 0.5s ease;
}

.chart-line div {
  width: calc(100% / 10);
  height: 100%;
  background-color: #2196f3;
  box-shadow: 0px 4px 4px rgba(33, 150, 243, 0.2);
}

.chart-line div:nth-child(2n) {
  background-color: #64b5f6;
}

.chart-line div:last-child {
  position: relative;
  background-color: #ffffff;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  box-shadow: 0px 2px 2px rgba(33, 150, 243, 0.2);
  margin-bottom: -20px;
}
</style> -->