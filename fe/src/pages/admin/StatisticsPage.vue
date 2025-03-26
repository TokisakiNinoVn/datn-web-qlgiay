<template>
  <div class="home-page">
    <Navbar />
    <div class="main-content">
      <h2 class="page-title">Thống kê tổng quan</h2>

      <div class="stats-container">
        <!-- Biểu đồ cột doanh thu theo tháng -->
        <div class="stat-card chart-card full-width">
          <h3 class="card-title">Doanh thu theo tháng (6 tháng gần nhất)</h3>
          <div id="revenue-column-chart" class="chart"></div>
          <div>
            <button @click="exportToExcel" style="">Xuất Excel</button>
          </div>
        </div>

        <!-- Biểu đồ tròn nhập/xuất kho -->
        <div class="stat-card chart-card">
          <h3 class="card-title">Tỷ lệ nhập/xuất kho tháng {{ currentMonth }}</h3>
          <div id="stock-pie-chart" class="chart"></div>
        </div>

        <!-- Top sản phẩm xuất khẩu -->
        <div class="stat-card">
          <h3 class="card-title">Top sản phẩm xuất kho</h3>
          <ul class="top-list">
            <li v-for="(product, index) in statistics.topExportedProducts" :key="product.product_id" :class="`rank-${index + 1}`">
              <span class="rank">#{{ index + 1 }}</span> {{ product.product_name }} - Xuất: {{ product.totalExported }} sản phẩm
            </li>
            <li v-if="!statistics.topExportedProducts.length">Chưa có dữ liệu</li>
          </ul>
        </div>

        <!-- Top sản phẩm nhập khẩu -->
        <div class="stat-card">
          <h3 class="card-title">Top sản phẩm nhập kho</h3>
          <ul class="top-list">
            <li v-for="(product, index) in statistics.topImportedProducts" :key="product.product_id" :class="`rank-${index + 1}`">
              <span class="rank">#{{ index + 1 }}</span> {{ product.product_name }} - Nhập: {{ product.totalImported }} sản phẩm
            </li>
            <li v-if="!statistics.topImportedProducts.length">Chưa có dữ liệu</li>
          </ul>
        </div>

        <!-- Sản phẩm hết hàng -->
        <div class="stat-card out-of-stock-card" v-if="statistics.lowStockProducts.length">
          <h3 class="card-title">Sản phẩm sắp hết hàng</h3>
          <ul class="top-list">


            <li v-for="(product, index) in statistics.lowStockProducts" :key="product.id" :class="`rank-${index + 1}`">
              <span class="rank">{{ index + 1 }} - </span> {{ product.product_name }}
            </li>
            <li v-if="!statistics.lowStockProducts">Chưa có dữ liệu</li>
          

            <!-- <li v-for="product in statistics.lowStockProducts" :key="product.id">
              {{ product.product_name }}
            </li> -->
          </ul>
        </div>
        <div class="stat-card out-of-stock-card" v-if="statistics.outOfStockProducts.length">
          <h3 class="card-title">Sản phẩm hết hàng</h3>
          <ul class="top-list">

            
            <li v-for="(product, index) in statistics.outOfStockProducts" :key="product.id" :class="`rank-${index + 1}`">
              <span class="rank">{{ index + 1 }} - </span> {{ product.product_name }}
            </li>
            <li v-if="!statistics.outOfStockProducts">Chưa có dữ liệu</li>

            <!-- <li v-for="product in statistics.outOfStockProducts" :key="product.id">
              {{ product.product_name }}
            </li> -->
          </ul>
        </div>
      </div>

      <div class="footer">
        <span> @2025 - Bản quyền thuộc về Công ty TNHH ABC </span>
        <!-- <a href="http://github.com" target="_blank" rel="noopener noreferrer"><b>@Github</b></a> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ApexCharts from 'apexcharts';
import Navbar from '../../components/NavbarComponent.vue';
import { useRouter } from 'vue-router';
import { getGeneralInfoApi } from '@/services/modules/statistics.api';
import * as XLSX from "xlsx";


const router = useRouter();
const statistics = ref({
  topExportedProducts: [],
  topImportedProducts: [],
  outOfStockProducts: [],
  stockSummary: [],
  lowStockProducts: [],
});
const currentMonth = ref(new Date().toLocaleString('vi-VN', { month: 'long', year: 'numeric' }));

const fetchStatistics = async () => {
  try {
    const response = await getGeneralInfoApi();
    statistics.value = response.data.data;
    renderColumnChart();
    renderPieChart();
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
};

const renderColumnChart = () => {
  if (!statistics.value.stockSummary.length) return;

  const recentMonths = statistics.value.stockSummary.slice(0, 6);
  const chartOptions = {
    chart: { type: 'bar', height: 350 },
    series: [
      { name: 'Tổng nhập kho', data: recentMonths.map(item => parseFloat(item.totalImportPrice)) },
      { name: 'Tổng xuất kho', data: recentMonths.map(item => parseFloat(item.totalExportPrice)) },
    ],
    xaxis: { categories: recentMonths.map(item => item.monthYear) },
    colors: ['#28a745', '#dc3545'],
    plotOptions: { bar: { columnWidth: '50%' } },
    dataLabels: { enabled: false },
    legend: { position: 'top', fontSize: '14px', labels: { colors: '#343a40' } },
    tooltip: {
      y: {
        formatter: (val) => `${new Intl.NumberFormat('vi-VN').format(val)} VNĐ`,
      },
    },
  };

  const chart = new ApexCharts(document.querySelector('#revenue-column-chart'), chartOptions);
  chart.render();
};

const renderPieChart = () => {
  if (!statistics.value.stockSummary.length) return;

  // const latestSummary = statistics.value.stockSummary[0];
  const latestSummary = statistics.value.stockSummary[statistics.value.stockSummary.length - 1];
  const totalImport = parseFloat(latestSummary.totalImportPrice);
  const totalExport = parseFloat(latestSummary.totalExportPrice);

  const chartOptions = {
    chart: { type: 'pie', height: 300 },
    series: [totalImport, totalExport],
    labels: ['Tổng nhập kho', 'Tổng xuất kho'],
    colors: ['#28a745', '#dc3545'],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(val)}%`,
    },
    legend: {
      position: 'bottom',
      fontSize: '14px',
      labels: { colors: '#343a40' },
    },
    tooltip: {
      y: {
        formatter: (val) => `${new Intl.NumberFormat('vi-VN').format(val)} VNĐ`,
      },
    },
  };

  const chart = new ApexCharts(document.querySelector('#stock-pie-chart'), chartOptions);
  chart.render();
};

onMounted(() => {
  const loginTime = localStorage.getItem('loginTime');
  const currentTimestamp = new Date().getTime();
  if (currentTimestamp - loginTime > 1000 * 60 * 60 * 12) {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    router.push('/login');
    return;
  }

  if (localStorage.getItem('isLoggedIn') !== 'true') {
    alert('Bạn cần đăng nhập!');
    router.push('/login');
    return;
  }

  fetchStatistics();
});

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(statistics.value.stockSummary);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "thongke-baocao.xlsx");
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
}

.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #343a40;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.full-width {
  grid-column: 1 / -1;
}

.chart-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  color: #343a40;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.chart {
  width: 100%;
  max-width: 600px;
}

.top-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.top-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.top-list li:last-child {
  border-bottom: none;
}

.rank {
  font-weight: 700;
  min-width: 30px;
}

.rank-1 { font-size: 1.25rem; color: #ff4500; }
.rank-2 { font-size: 1.1rem; color: #ff8c00; }
.rank-3 { font-size: 1rem; color: #ffa500; }
.top-list li:not(.rank-1):not(.rank-2):not(.rank-3) .rank {
  font-size: 0.9rem;
  color: #6c757d;
}

.out-of-stock-card h3 {
  color: #dc3545;
}

.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
  border-top: 1px solid #e9ecef;
  margin-top: 2rem;
}

.footer a {
  color: #007bff;
  text-decoration: none;
  margin-left: 0.5rem;
}

.footer a:hover {
  text-decoration: underline;
}
</style>