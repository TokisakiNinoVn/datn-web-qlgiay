<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeDetail">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Hồ sơ Người dùng</h2>
        <button @click="closeDetail" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="profile-container">
          <!-- Avatar Section -->
          <div class="avatar-section">
            <img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              alt="Ảnh hồ sơ"
              class="avatar-img"
            >
            <img
              v-else
              src="https://i.pinimg.com/736x/dc/bf/44/dcbf443fe182e29d56214dbe7067a5e3.jpg"
              alt="Ảnh mặc định"
              class="avatar-img"
            >
            <div class="name-role">
              <h3>{{ user.full_name || 'N/A' }}</h3>
              <p class="role"> <span v-if="user.full_name == 'Tokisaki Nino'" ><i class="fa-solid fa-crown" style="color: yellow;"></i></span> {{ user.role || 'Chưa có chức vụ' }}</p>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <div class="info-item">
              <span class="label"><i class="fas fa-envelope mr-2"></i> Email:</span>
              <span class="value">{{ user.email || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-phone mr-2"></i> Điện thoại:</span>
              <span class="value">{{ user.phone || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-map-marker-alt mr-2"></i> Địa chỉ:</span>
              <span class="value">{{ user.address || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-venus-mars mr-2"></i> Giới tính:</span>
              <span class="value">{{ user.gender || 'Chưa cập nhật' }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-calendar-plus mr-2"></i> Ngày tạo:</span>
              <span class="value">{{ formatDate(user.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-calendar-check mr-2"></i> Cập nhật cuối:</span>
              <span class="value">{{ formatDate(user.updateAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label"><i class="fas fa-sticky-note mr-2"></i> Ghi chú:</span>
              <span class="value">{{ user.note || 'Không có' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeDetail" class="close-btn">
          <i class="fas fa-times mr-2"></i> Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
// import instance from '@/services/axiosConfig';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const closeDetail = () => {
  emit('close');
};

const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleString('vi-VN') : 'N/A';
};
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.modal-header {
  background: #3498db;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: white;
  transition: transform 0.3s;
}

.modal-close-btn:hover {
  transform: rotate(90deg);
  color: #ecf0f1;
}

.modal-body {
  padding: 25px;
}

/* Profile Styles */
.profile-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3498db;
}

.name-role h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.name-role .role {
  font-size: 1rem;
  color: #636e72;
  margin: 0.25rem 0 0;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.3s;
}

.info-item:hover {
  background: #f1f2f6;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;
}

.label i {
  color: #3498db;
}

.value {
  font-size: 1rem;
  color: #636e72;
  flex: 2;
  text-align: left;
}

.modal-footer {
  padding: 15px 25px;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.close-btn:hover {
  background: #c0392b;
}

@media (min-width: 640px) {
  .info-section {
    /* display: grid;
    grid-template-columns: 1fr 1fr; */
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>