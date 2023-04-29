<template>
  <div class="pie-chart">
    <svg :width="150">
      <g transform="translate(70, 80)">
        <circle r="40" fill="white" stroke="#ddd" stroke-width="5"></circle>
        <path
          v-for="(slice, index) in slices"
          :key="index"
          :fill="slice.color"
          :d="describeArc(0, 0, 70, slice.startAngle, slice.endAngle)"
        ></path>
      </g>
    </svg>
    <div class="pie-info">
        <div class="info-item" v-for="(item, i) in data" :key="i" :style="`--pie-item-color: ${item.color};`">
            {{ item.title }}
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, Ref, ref } from 'vue'

// defineProps<{ data: [], size: number, }>()

const data = [
    { color: '#FF1744', value: 30, title: 'Новый' }, 
    { color: '#AA00FF', value: 45, title: 'Обработан' }, 
    { color: '#304FFE', value: 15, title: 'Отправлен' },
    { color: '#00E676', value: 10, title: 'Доставлен' },
]

const slices: Ref<any[]> = ref([])
const calculateSlices = () => {
    let total = 0;
    data.forEach((item) => (total += item.value));
    let startAngle = 0;
    slices.value = data.map((item) => {
    const slice = {
        color: item.color,
        startAngle,
        endAngle: startAngle + (item.value / total) * 360,
    };
    startAngle = slice.endAngle;
    return slice;
    });
}

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${x} ${y} Z`;
}

const polarToCartesian = (x: number, y: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180);

    return {
        x: x + radius * Math.cos(angleInRadians),
        y: y + radius * Math.sin(angleInRadians),
    }
}

calculateSlices()
</script>

<style scoped>
.pie-chart {
    display: flex;
    height: 200px;
    justify-content: center;
    gap: 20px;
    align-items: center;
}
.pie-info{
    display: flex;
    flex-direction: column;
    gap: 15px;
}
.pie-info .info-item{
    position: relative;
    display: flex;
    align-items: center;
    gap: 9px;
}
.pie-info .info-item::before{
    content: '';
    width: 30px;
    height: 3px;
    background: var(--pie-item-color);
}
</style>