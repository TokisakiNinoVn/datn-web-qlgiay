<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Chi tiết kho - {{ warehouse.name }}</h2>
        <button @click="closeModal" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-details">
        <div class="detail-item">
          <span class="label">Địa chỉ:</span>
          <span>{{ warehouse.address }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Quản lý:</span>
          <span v-if="warehouse.manager_info !== null">{{ warehouse.manager_info.full_name }}</span>
          <span v-else>Chưa có</span>
        </div>
        <div class="detail-item">
          <span class="label">Số điện thoại:</span>
          <span v-if="warehouse.manager_info !== null">{{ warehouse.manager_info.phone }}</span>
          <span v-else>Chưa có thông tin</span>
          <!-- <span>{{ warehouse.manager_info. }}</span> -->
        </div>
        <div class="detail-item">
          <span class="label">Email:</span>
          <span v-if="warehouse.manager_info !== null">{{ warehouse.manager_info.email }}</span>
          <span v-else>Chưa có thông tin</span>
          <!-- <span>{{ warehouse.manager_info. }}</span> -->
        </div>
        <div class="detail-item">
          <span class="label">Mô tả:</span>
          <span>{{ warehouse.description || 'Không có' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Ngày tạo:</span>
          <span>{{ formatDate(warehouse.createdAt) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Cập nhật cuối:</span>
          <span>{{ formatDate(warehouse.updateAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  warehouse: {
    type: Object,
    default: () => ({}),
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};
</script>

<style scoped>
/* Modal */
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
  padding: 0;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.modal-header {
  background: #2ecc71;
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

.modal-details {
  padding: 25px;
}

.detail-item {
  display: flex;
  margin: 15px 0;
  gap: 15px;
  align-items: flex-start;
}

.detail-item .label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 130px;
  font-size: 15px;
}

.detail-item span:not(.label) {
  color: #636e72;
  font-size: 15px;
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