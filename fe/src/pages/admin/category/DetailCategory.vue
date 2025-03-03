<template>
  <div v-if="visible" class="modal-overlay" @click.self="closeDetail">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Chi tiết Nhà cung cấp: {{ category.name }}</h2>
        <button @click="closeDetail" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <table class="detail-table">
          <tbody>
            <!-- <tr>
              <td class="label">ID</td>
              <td class="value">{{ category.id }}</td>
            </tr> -->
            <tr>
              <td class="label">Tên danh mục</td>
              <td class="value">{{ category.name }}</td>
            </tr>
            <tr>
              <td class="label">Số lượng sản phẩm</td>
              <td class="value">{{ category.total_products }}</td>
            </tr>
            <!-- <tr>
              <td class="label">Số điện thoại</td>
              <td class="value">{{ category.phone }}</td>
            </tr>
            <tr>
              <td class="label">Email</td>
              <td class="value">{{ category.email }}</td>
            </tr>
            <tr>
              <td class="label">Địa chỉ</td>
              <td class="value">{{ category.address }}</td>
            </tr> -->
            <tr>
              <td class="label">Ngày tạo</td>
              <td class="value">{{ formatDate(category.createdAt) }}</td>
            </tr>
            <tr>
              <td class="label">Cập nhật cuối</td>
              <td class="value">{{ formatDate(category.updateAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button @click="closeDetail" class="close-btn">
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  category: {
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
  return new Date(dateString).toLocaleDateString('vi-VN');
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

.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table tr {
  border-bottom: 1px solid #e8ecef;
}

.detail-table .label {
  font-weight: 600;
  color: #2c3e50;
  padding: 15px;
  width: 40%;
  background: #f8f9fa;
}

.detail-table .value {
  color: #636e72;
  padding: 15px;
  width: 60%;
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
  transition: background 0.3s;
}

.close-btn:hover {
  background: #c0392b;
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