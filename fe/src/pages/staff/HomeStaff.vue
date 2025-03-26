<template>
  <div class="home-page">
    <Navbar />
    <div class="main-content">
      <div class="header-section">
        <h1 class="title">Dashboard</h1>
        <div class="header-info">
          <div class="date-time">
            <i class="fas fa-calendar-check"></i> {{ currentDate }} - <i class="fas fa-hourglass-half"></i> {{ currentTime }}
          </div>
          <div class="user-info">
            <i class="fas fa-user-tie"></i> Xin chào, {{ userName }}
          </div>
        </div>
      </div>

      <div class="stats-container">
        <div class="stat-card total-users">
          <i class="fas fa-users-cog icon"></i>
          <h3>Tổng người dùng</h3>
          <p>{{ statistics.totalUsers }}</p>
        </div>
        <div class="stat-card total-products">
          <i class="fas fa-box-open icon"></i>
          <h3>Tổng sản phẩm</h3>
          <p>{{ statistics.totalProducts }}</p>
        </div>
        <div class="stat-card total-categories">
          <i class="fas fa-tags icon"></i>
          <h3>Tổng danh mục</h3>
          <p>{{ statistics.totalCategories }}</p>
        </div>
        <div class="stat-card total-brands">
          <i class="fas fa-briefcase icon"></i>
          <h3>Tổng thương hiệu</h3>
          <p>{{ statistics.totalBrands }}</p>
        </div>
        <div class="stat-card total-suppliers">
          <i class="fas fa-truck-loading icon"></i>
          <h3>Tổng nhà cung cấp</h3>
          <p>{{ statistics.totalSuppliers }}</p>
        </div>
        <div class="stat-card total-enter-warehouse">
          <i class="fas fa-arrow-alt-circle-down icon"></i>
          <h3>Số đơn nhập kho</h3>
          <p>{{ statistics.totalTurnEnterWarehouse }}</p>
        </div>
        <div class="stat-card total-export-warehouse">
          <i class="fas fa-arrow-alt-circle-up icon"></i>
          <h3>Số đơn xuất kho</h3>
          <p>{{ statistics.totalTurnExportWarehouse }}</p>
        </div>
        <div class="stat-card total-export-warehouse">
          <i class="fas fa-dollar-sign icon"></i>
          <h3>Tổng giá trị xuất kho</h3>
          <p>{{ formatCurrency(statistics.totalExportWarehouse) }} VNĐ</p>
        </div>
        <div class="stat-card total-export-warehouse">
          <i class="fas fa-dollar-sign icon"></i>
          <h3>Tổng giá trị nhập kho</h3>
          <p>{{ formatCurrency(statistics.totalEnterWarehouse) }} VNĐ</p>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">Hành động nhanh</h2>
        <div class="action-buttons">
          <router-link to="/add-product">
            <button class="action-btn add-product">
              <i class="fas fa-plus-circle" style="margin-right: 0.5rem;"></i> Thêm sản phẩm
            </button>
          </router-link>
          <router-link v-if="roleUser.code === 'admin'" to="/warehouse-management/add">
            <button class="action-btn add-product">
              <i class="fas fa-plus-circle" style="margin-right: 0.5rem;"></i> Thêm kho mới
            </button>
          </router-link>
          <router-link to="/enterwarehouse-create">
            <button class="action-btn add-product">
              <i class="fas fa-plus-circle" style="margin-right: 0.5rem;"></i> Tạo phiếu nhập kho mới
            </button>
          </router-link>
          <!-- <button class="action-btn export-report">
            <i class="fas fa-file-download" style="margin-right: 0.5rem;"></i> Xuất báo cáo
          </button>
          <button class="action-btn view-stock">
            <i class="fas fa-warehouse" style="margin-right: 0.5rem;"></i> Xem tồn kho
          </button> -->
        </div>
      </div>
      <div class="footer">
        <span> @2025 - Bản quyền thuộc về Công ty TNHH Hoàng Hợp :v</span>
        <a href="http://github.com" target="_blank" rel="noopener noreferrer"><b>@Github</b></a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Navbar from '../../components/NavbarComponent.vue';
import { useRouter } from 'vue-router';
import { getGeneralInfoApi } from '@/services/modules/home.api';

const roleUser = JSON.parse(localStorage.getItem('roles'))
const dataUser = JSON.parse(localStorage.getItem('user'))

const router = useRouter();
const currentDate = ref(new Date().toLocaleDateString('vi-VN'));
const currentTime = ref(new Date().toLocaleTimeString('vi-VN'));
const userName = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : 'Người dùng');
const statistics = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalCategories: 0,
  totalBrands: 0,
  totalSuppliers: 0,
  totalEnterWarehouse: 0,
  totalExportWarehouse: 0,
  totalTurnExportWarehouse: 0,
  totalTurnEnterWarehouse: 0,
});

const formatCurrency = (value) => {
  if(value) {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(value)) + ' VNĐ'
  }
  return '0 VNĐ'
};

const fetchStatistics = async () => {
  try {
    const response = await getGeneralInfoApi();
    statistics.value = response.data.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('vi-VN');
};

onMounted(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
    router.push('/login');
    return;
  }
  if ((dataUser.warehouses.length === 0 && roleUser.code === 'admin') || (dataUser.warehouses.length !== 0 && roleUser.code !== 'admin')) {
    fetchStatistics();
  } else {
    alert('Bạn chưa có phân quyền chỉ định cho kho nào nên không thể xem các thông tin liên quan đến kho hàng, vui lòng liên hệ quản trị viên để được hỗ trợ!');
  }

  // fetchStatistics();
  const timeInterval = setInterval(updateTime, 1000);
  onUnmounted(() => clearInterval(timeInterval));
});
// onMounted(() => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn');
  
//   if (isLoggedIn !== 'true') {
//     alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
//     router.push('/login');
//     return;
//   }

//   const warehouses = dataUser.warehouses;
//   const userRole = roleUser.code;

//   if (warehouses.length > 0 || userRole === 'admin') {
//     fetchStatistics();
//   } else if (warehouses.length === 0 && (userRole === 'manager' || userRole === 'staff')) {
//     alert('Bạn chưa có phân quyền chỉ định cho kho nào nên không thể xem các thông tin liên quan đến kho hàng, vui lòng liên hệ quản trị viên để được hỗ trợ!');
//   }

//   const timeInterval = setInterval(updateTime, 1000);
//   onUnmounted(() => clearInterval(timeInterval));
// });
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

.header-section {
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #fff;
  font-weight: 700;
  margin: 0;
}

.header-info {
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 1rem;
  margin-top: 1rem;
}

.date-time, .user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.stat-card h3 {
  font-size: 1.1rem;
  color: #343a40;
  margin: 0.5rem 0;
}

.stat-card p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #007bff;
}

.icon {
  font-size: 2rem;
  color: #007bff;
}

.quick-actions {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 600;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.add-product {
  background: #28a745;
  color: white;
}

.add-product:hover {
  background: #218838;
}

.export-report {
  background: #ffc107;
  color: #343a40;
}

.export-report:hover {
  background: #e0a800;
}

.view-stock {
  background: #17a2b8;
  color: white;
}

.view-stock:hover {
  background: #138496;
}

.footer {
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
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