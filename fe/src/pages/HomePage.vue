<template>
  <div class="home-page">
    <Navbar />
    <div class="main-content">
      <div class="header-section">
        <h1 class="title">Dashboard</h1>
        <div class="header-info">
          <div class="date-time">
            <i class="fas fa-calendar-alt"></i> {{ currentDate }} - <i class="fas fa-clock"></i> {{ currentTime }}
          </div>
          <div class="user-info">
            <i class="fas fa-user-circle"></i> Xin chào, {{ userName }}
          </div>
        </div>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label for="month">Thống kê tháng:</label>
          <select v-model="selectedMonth" @change="fetchStatistics">
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
        </div>
        <!-- <div class="search-bar">
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm sản phẩm..." />
          <i class="fas fa-search"></i>
        </div> -->
        <button class="refresh-btn" @click="fetchStatistics">
          <i class="fas fa-sync-alt"></i> Làm mới
        </button>
      </div>

      <div class="stats-container">
        <div class="stat-card total-products">
          <i class="fas fa-shoe-prints icon"></i>
          <h3>Tổng sản phẩm</h3>
          <p>{{ statistics.totalProducts }}</p>
        </div>
        <div class="stat-card stock-status">
          <i class="fas fa-boxes icon"></i>
          <div class="stock-details">
            <div>
              <h3>Còn hàng</h3>
              <p>{{ statistics.inStock }}</p>
            </div>
            <div>
              <h3>Hết hàng</h3>
              <p>{{ statistics.outOfStock }}</p>
            </div>
          </div>
        </div>
        <div class="stat-card revenue">
          <i class="fas fa-wallet icon"></i>
          <h3>Doanh thu tháng</h3>
          <p>{{ formatCurrency(statistics.revenue) }} VNĐ</p>
        </div>
        <div class="stat-card orders">
          <i class="fas fa-shopping-cart icon"></i>
          <h3>Đơn hàng</h3>
          <p>{{ statistics.orders }}</p>
        </div>
        <div class="stat-card low-stock">
          <i class="fas fa-exclamation-triangle icon"></i>
          <h3>Sản phẩm sắp hết</h3>
          <p>{{ statistics.lowStock }}</p>
        </div>
        <div class="stat-card suppliers">
          <i class="fas fa-truck icon"></i>
          <h3>Nhà cung cấp</h3>
          <p>{{ statistics.suppliers }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">Hành động nhanh</h2>
        <div class="action-buttons">
          <button class="action-btn add-product">
            <i class="fas fa-plus"></i> Thêm sản phẩm
          </button>
          <button class="action-btn export-report">
            <i class="fas fa-file-export"></i> Xuất báo cáo
          </button>
          <button class="action-btn view-stock">
            <i class="fas fa-eye"></i> Xem tồn kho
          </button>
        </div>
      </div>
      <div class="footer">
        <!-- Làm 1 cái footer -->
        <span> @2025 - Bản quyền thuộc về Công ty TNHH ABC - Developed by: Tokisaki Nino </span>
        <a href="http://" target="_blank" rel="noopener noreferrer"><b>@Github</b></a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '../components/NavbarComponent.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedMonth = ref(new Date().getMonth() + 1);
// const searchQuery = ref('');
const currentDate = ref(new Date().toLocaleDateString('vi-VN'));
const currentTime = ref(new Date().toLocaleTimeString('vi-VN'));
const userName = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Người dùng');
const statistics = ref({
  totalProducts: 100,
  inStock: 0,
  outOfStock: 0,
  revenue: 0,
  orders: 0,
  lowStock: 0,
  suppliers: 0,
});

const months = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

const fetchStatistics = async () => {
  try {
    console.log(`Fetching statistics for month: ${selectedMonth.value}`);
    statistics.value = {
      totalProducts: 150,
      inStock: 120,
      outOfStock: 30,
      revenue: 25000000,
      orders: 45,
      lowStock: 10,
      suppliers: 8,
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('vi-VN');
};

onMounted(() => {
  const loginTime = localStorage.getItem('loginTime');
  const currentTimestamp = new Date().getTime();
  if (currentTimestamp - loginTime > 1000 * 60 * 60 * 12) {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    router.push('/login');
    return;
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    router.push('/login');
    return;
  }

  fetchStatistics();
  const timeInterval = setInterval(updateTime, 1000);
  onUnmounted(() => clearInterval(timeInterval));
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(120deg, #f9e8d9 0%, #f5c7a9 100%);
  padding: 2rem;
  display: flex;
}

.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 0 2rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  color: #1a1a1a;
  font-weight: 800;
  margin: 0;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
}

.date-time, .user-info {
  color: #666;
  font-size: 1rem;
}

.date-time i, .user-info i {
  margin-right: 0.5rem;
  color: #ff6f61;
}

.filters {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters select {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #f9f9f9;
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-bar input {
  width: 90%;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #f9f9f9;
}

.search-bar i {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6f61;
}

.refresh-btn {
  padding: 0.75rem 1.5rem;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #e65b50;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-card .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-card h3 {
  font-size: 1.2rem;
  color: #1a1a1a;
  margin: 0.5rem 0;
}

.stat-card p {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #ff6f61;
}

.stock-details {
  display: flex;
  justify-content: space-around;
}

.stock-details div {
  flex: 1;
}

.total-products .icon { color: #ff6f61; }
.stock-status .icon { color: #2ecc71; }
.revenue .icon { color: #f1c40f; }
.orders .icon { color: #3498db; }
.low-stock .icon { color: #e74c3c; }
.suppliers .icon { color: #9b59b6; }

.quick-actions {
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.8rem;
  color: #1a1a1a;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.action-btn {
  padding: 1rem 2rem;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #e65b50;
  transform: scale(1.05);
}

.add-product { background: #ff6f61; }
.export-report { background: #3498db; }
.view-stock { background: #2ecc71; }
</style>