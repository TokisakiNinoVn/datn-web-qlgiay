<template>
    <div>
      <h2>{{ title }}</h2>
      <canvas ref="chart"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  
  export default {
    props: {
      title: {
        type: String,
        default: 'Biểu đồ'
      },
      chartData: {
        type: Object,
        required: true
      },
      chartOptions: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props) {
      const chart = ref(null);
      const canvasRef = ref(null);
  
      onMounted(() => {
        chart.value = new Chart(canvasRef.value, {
          type: 'bar',
          data: props.chartData,
          options: props.chartOptions
        });
      });
  
      return {
        canvasRef
      };
    }
  };
  </script>
  
  <style scoped>
  canvas {
    max-width: 100%;
    max-height: 400px;
  }
  </style>
  