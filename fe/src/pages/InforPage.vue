<template>
  <div class="container">
    <Navbar />
    <div class="main-content" v-if="user">
      <div class="header">
        <h2 class="title">Thông tin nhân viên</h2>
      </div>
      
      <div class="profile-card">
        <div class="profile-header">
          <a href="https://nino.is-a.dev/" target="_blank" class="avatar-wrapper">
            <img 
              src="https://i.pinimg.com/736x/75/11/c5/7511c5289164c5644782b76e9d122f20.jpg" 
              alt="Avatar nhân viên" 
              class="avatar"
            >
          </a>
          <div class="profile-info">
            <div v-if="user.name" class="info-name">{{ user.name }}</div>
            <div v-if="user.role == 'landlord'" class="info-role"><span>Chủ trọ</span></div>
            <div v-else class="info-role"><span>Người thuê trọ</span></div>
          </div>
        </div>

        <div class="info-details">
          <!-- <div v-if="user.id" class="info-item">
            <i class="fas fa-id-badge "></i>
            <span class="label">ID Nhân viên:</span> 
            <span>{{ user.id }}</span>
          </div> -->
          <!-- <div v-if="user.username" class="info-item">
            <i class="fas fa-user "></i>
            <span class="label">Tên đăng nhập:</span> 
            <span>{{ user.username }}</span>
          </div> -->
          <div v-if="user.email" class="info-item">
            <i class="fas fa-envelope "></i>
            <span class="label">Email:</span> 
            <span>{{ user.email }}</span>
          </div>
          <div v-if="user.gender" class="info-item">
            <i class="fas fa-venus-mars "></i>
            <span class="label">Giới tính:</span> 
            <span>{{ user.gender }}</span>
          </div>
          <div v-if="user.phone" class="info-item">
            <i class="fas fa-phone "></i>
            <span class="label">Số điện thoại:</span> 
            <span>{{ user.phone }}</span>
          </div>
          <div v-if="user.address" class="info-item">
            <i class="fas fa-map-marker-alt "></i>
            <span class="label">Địa chỉ:</span> 
            <span>{{ user.address }}</span>
          </div>
          <div v-if="user.updatedAt" class="info-item">
            <i class="fas fa-clock "></i>
            <span class="label">Cập nhật lần cuối:</span> 
            <span>{{ formattedDate }}</span>
          </div>
        </div>

        <div class="actions">
          <router-link to="/home" class="action-btn back">
            <i class="fas fa-arrow-left "></i> Quay lại
          </router-link>
          <button @click="updateInfor" class="action-btn update">
            <i class="fas fa-edit "></i> Cập nhật
          </button>
          <button @click="handleLogout" class="action-btn logout">
            <i class="fas fa-sign-out-alt "></i> Đăng xuất
          </button>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <i class="fas fa-user-slash "></i>
      Không có thông tin nhân viên nào được tìm thấy.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/NavbarComponent.vue';

const router = useRouter();
const user = ref(null);
const formattedDate = ref('');

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    user.value = storedUser;
    formattedDate.value = new Date(storedUser.updatedAt).toLocaleString('vi-VN');
  } else {
    user.value = null;
  }
});

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  localStorage.setItem('isLoggedIn', 'false');
  router.push('/login');
};

const updateInfor = () => {
  alert("Chức năng đang được phát triển! 🥲");
};
</script>

<style scoped>
i {
  margin-right: 5px;
}
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
}

.main-content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
  text-align: center;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid transparent;
  transition: all 0.3s;
}

.avatar:hover {
  border-color: #e91e63;
  transform: scale(1.05);
}

.profile-info {
  margin-left: 1.5rem;
}

.info-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.info-role {
  font-size: 1rem;
  color: #666;
  margin-top: 0.25rem;
}

.info-details {
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
}

.info-item i {
  color: #3498db;
  width: 20px;
}

.label {
  font-weight: 500;
  color: #666;
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  text-decoration: none;
}

.back {
  background: #ecf0f1;
  color: #666;
}

.back:hover {
  background: #dfe6e9;
}

.update {
  background: #f1c40f;
  color: white;
}

.update:hover {
  background: #e1b107;
}

.logout {
  background: #e74c3c;
  color: white;
}

.logout:hover {
  background: #c0392b;
}

.no-data {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.25rem;
  gap: 0.5rem;
}
</style>