<template>
    <div class="chart-card p-4 bg-white shadow-md rounded-lg">
      <h2 class="text-center font-bold text-xl mb-4">{{ title }}</h2>
      <ChartJS
        :type="chartType"
        :data="chartData"
        :options="chartOptions"
        class="chart"
      />
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import { Chart as ChartJS, registerables } from 'chart.js';
//   import { Chart as ChartJSComponent } from 'vue-chartjs';
  
  ChartJS.register(...registerables);
  
  defineProps({
    title: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartType: {
      type: String,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
      }),
    },
  });
  </script>
  
  <style scoped>
  .chart-card {
    width: 100%;
    height: 400px;
  }
  .chart {
    width: 100%;
    height: 100%;
  }
  </style>
  