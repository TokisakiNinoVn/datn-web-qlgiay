<template>
  <div class="main-navbar">
    <nav class="navbar">
      <!-- Profile Card -->
      <router-link class="profile-card" to="/home">
        <img
          class="page-logo"
          src="../../public/logo-navbar-16x9.png"
          alt="Shoe Inventory Logo"
        />
        <div class="profile-info">
          <!-- <span class="profile-role" style="text-transform: uppercase;">{{ userRole }} <span v-if="userRole !== 'admin' && dataUser.warehouses[0] !== []">- {{ dataUser.warehouses[0].name }}</span></span> -->
          <span class="profile-role" style="text-transform: uppercase;">
            {{ userRole }} 
            <span v-if="userRole !== 'admin' && dataUser.warehouses.length > 0">- {{ dataUser.warehouses[0].name }}</span>
          </span>
          <span class="profile-role"></span>
          <span class="profile-name" style="margin-top: 10px;">{{ dataUser.name }}</span>
        </div>
      </router-link>

      <!-- Navigation Items -->
      <div class="nav-items">
        <router-link v-if="userRole !== 'staff'" class="nav-item" to="/home">
          <i class="fas fa-home"></i>
          <span>Trang chủ</span>
        </router-link>
        <router-link v-if="userRole === 'staff'" class="nav-item" to="/home-staff">
          <i class="fas fa-home"></i>
          <span>Trang chủ</span>
        </router-link>

        <router-link v-if="userRole === 'admin'" class="nav-item" to="/warehouse-management">
          <i class="fas fa-warehouse mr-2"></i> 
          <span>Quản lý kho</span>
        </router-link>
        <router-link v-if="userRole === 'admin' || userRole === 'manager'" class="nav-item" to="/management-user">
          <i class="fas fa-users-cog"></i>
          <span v-if="userRole === 'manager'">Quản lý nhân viên</span>
          <span v-else>Quản lý người dùng</span>
        </router-link>

        <router-link v-if="userRole === 'admin' || userRole === 'manager'" class="nav-item" to="/category-management">
          <i class="fas fa-th-list"></i>
          <span>Quản lý danh mục</span>
        </router-link>

        <router-link v-if="userRole === 'admin' || userRole === 'manager'" class="nav-item" to="/brand-management">
          <i class="fas fa-tags"></i>
          <span>Quản lý thương hiệu</span>
        </router-link>

        <router-link v-if="userRole === 'admin' || userRole === 'manager'" class="nav-item" to="/supplier-management">
          <!-- <router-link class="nav-item" to="/supplier-management"> -->
          <i class="fas fa-truck"></i>
          <span>Quản lý nhà cung cấp</span>
        </router-link>

        <router-link v-if="userRole === 'admin' || userRole === 'manager' || userRole === 'staff'" class="nav-item" to="/product-management">
          <i class="fas fa-boxes-stacked"></i>
          <span>Quản lý hàng hóa</span>
        </router-link>

        <router-link v-if="userRole === 'admin' || userRole === 'manager' || userRole === 'staff'" class="nav-item" to="/enter-management">
          <i class="fas fa-cart-arrow-down"></i>
          <span>Quản lý nhập kho</span>
        </router-link>

        <!-- <router-link v-if="userRole === 'admin' || userRole === 'manager' || userRole === 'staff'" class="nav-item" to="/export-management"> -->
        <router-link class="nav-item" to="/export-management">
          <i class="fas fa-dolly"></i>
          <span>Quản lý xuất kho</span>
        </router-link>

        <!-- <router-link v-if="userRole === 'admin' || userRole === 'manager' || userRole === 'staff'" class="nav-item" to="/statistics"> -->
        <router-link class="nav-item" to="/statistics">
          <i class="fas fa-chart-line"></i>
          <span>Báo cáo & Thống kê</span>
        </router-link>
      </div>

      <!-- Divider -->
      <hr class="divider" />

      <!-- User Actions -->
      <div class="user-actions">
        <router-link class="nav-item" to="/profile">
          <i class="fas fa-user-circle"></i>
          <span>Hồ sơ</span>
        </router-link>

        <a class="nav-item logout-btn" @click.prevent="handleLogout" href="#">
          <i class="fas fa-sign-out-alt"></i>
          <span>Đăng xuất</span>
        </a>
      </div>

      <!-- Footer Branding -->
      <div class="navbar-footer">
        <span>© 2025 ShoeStock</span>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, createApp } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '@/services/modules/auth.api';
import NotificationComponent from '@/components/NotificationComponent.vue';

const router = useRouter();
const parsedRole = JSON.parse(localStorage.getItem('roles'));
const userRole = parsedRole.code;

const dataUser = JSON.parse(localStorage.getItem('user'));



const handleLogout = async () => {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    const userInfor = JSON.parse(localStorage.getItem('user'));
    const id = userInfor.id;
    const response = await logout(id);
    if (response.status === 200) {
      // alert('Đăng xuất thành công');
      showNotification('Đăng xuất thành công', 'success');
      router.push('/login');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('roles');
      localStorage.removeItem('loginTime');
      localStorage.setItem('isLoggedIn', 'false');
    }
  }
};

const showNotification = (message, type) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const app = createApp(NotificationComponent, { message, type });

  // eslint-disable-next-line no-unused-vars
  const instance = app.mount(container);
  // Tự động xóa thông báo sau 3 giây
  setTimeout(() => {
    app.unmount();
    document.body.removeChild(container);
  }, 3000);
};

onMounted(() => {
  // Logic for roles can be added here if needed
});
</script>

<style scoped>
.main-navbar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1a1a1a 0%, #2c2c2c 100%);
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  font-family: 'Roboto', sans-serif;
}

.navbar {
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  height: 100%;
}

/* Profile Card */
.profile-card {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 2.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.profile-card:hover {
  background: rgba(255, 111, 97, 0.1);
  transform: translateY(-3px);
}

.page-logo {
  width: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 10px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-role {
  font-size: 0.85rem;
  color: #ff6f61;
  font-weight: 500;
}

.profile-name {
  font-size: 1.2rem;
  color: #fff;
  font-weight: 600;
}

/* Navigation Items */
.nav-items {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: #d1d1d1;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}

.nav-item i {
  width: 24px;
  margin-right: 1rem;
  font-size: 1.2rem;
}

.nav-item span {
  font-size: 1rem;
  font-weight: 500;
}

.nav-item:hover {
  background: rgba(255, 111, 97, 0.1);
  color: #ff6f61;
}

.nav-item.router-link-active {
  background: rgba(255, 111, 97, 0.2);
  color: #ff6f61;
}

/* Divider */
.divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
  margin: 2rem 0;
}

/* User Actions */
.user-actions {
  margin-top: auto;
}

.user-actions .nav-item {
  margin-bottom: 0.75rem;
}

.logout-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

/* Footer Branding */
.navbar-footer {
  text-align: center;
  padding-top: 1rem;
  font-size: 0.85rem;
  color: #888;
}

/* Icon Colors */
.nav-item i {
  color: #d1d1d1;
}

.nav-item:hover i,
.nav-item.router-link-active i {
  color: #ff6f61;
}

.logout-btn:hover i {
  color: #e74c3c;
}
</style>