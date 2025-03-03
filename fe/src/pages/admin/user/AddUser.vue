<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Thêm Người dùng Mới</h2>
        <button @click="close" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="handleAdd" class="form-container">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user mr-2"></i> Họ và tên
            </label>
            <input
              v-model="formData.full_name"
              type="text"
              placeholder="Nhập họ và tên"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-envelope mr-2"></i> Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="Nhập email"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-phone mr-2"></i> Số điện thoại
            </label>
            <input
              v-model="formData.phone"
              type="text"
              placeholder="Nhập số điện thoại"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock mr-2"></i> Mật khẩu
            </label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="Nhập mật khẩu"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-venus-mars mr-2"></i> Giới tính
            </label>
            <select v-model="formData.gender" class="form-select">
              <option :value="null">Chưa chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-user-tag mr-2"></i> Vai trò
            </label>
            <select v-model="formData.role_code" class="form-select" required>
              <option value="" disabled>Chọn vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý kho</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>

          <div class="form-group full-width">
            <label class="form-label">
              <i class="fas fa-map-marker-alt mr-2"></i> Địa chỉ
            </label>
            <input
              v-model="formData.address"
              type="text"
              placeholder="Nhập địa chỉ"
              class="form-input"
            />
          </div>

          <div class="form-group full-width">
            <label class="form-label">
              <i class="fas fa-sticky-note mr-2"></i> Ghi chú
            </label>
            <input
              v-model="formData.note"
              type="text"
              placeholder="Nhập ghi chú (không bắt buộc)"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="close" class="cancel-btn">
            <i class="fas fa-times mr-2"></i> Hủy
          </button>
          <button type="submit" class="submit-btn">
            <i class="fas fa-plus mr-2"></i> Thêm người dùng
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'addCustomer']);

const formData = ref({
  full_name: '',
  phone: '',
  address: '',
  gender: null,
  email: '',
  note: '',
  password: '',
  role_code: '',
});

const handleAdd = () => {
  const newUser = {
    full_name: formData.value.full_name,
    phone: formData.value.phone,
    address: formData.value.address || '',
    gender: formData.value.gender,
    email: formData.value.email,
    note: formData.value.note || '',
    password: formData.value.password,
    role_code: formData.value.role_code,
  };
  emit('addCustomer', newUser);
  resetForm();
};

const resetForm = () => {
  formData.value = {
    full_name: '',
    phone: '',
    address: '',
    gender: null,
    email: '',
    note: '',
    password: '',
    role_code: '',
  };
};

const close = () => {
  emit('close');
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

.modal-container {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease;
}

.modal-header {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  padding: 20px;
  border-radius: 16px 16px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: white;
  transition: transform 0.3s, color 0.3s;
}

.modal-close-btn:hover {
  transform: rotate(90deg);
  color: #ecf0f1;
}

.form-container {
  padding: 25px;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.form-label i {
  color: #2ecc71;
  margin-right: 8px;
}

.form-input, .form-select {
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  background: #fdfdfd;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus, .form-select:focus {
  border-color: #2ecc71;
  outline: none;
  box-shadow: 0 0 6px rgba(46, 204, 113, 0.3);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-btn, .cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s, transform 0.3s;
}

.submit-btn {
  background: #2ecc71;
  color: white;
}

.submit-btn:hover {
  background: #27ae60;
  transform: translateY(-2px);
}

.cancel-btn {
  background: #ecf0f1;
  color: #2c3e50;
}

.cancel-btn:hover {
  background: #dfe6e9;
  color: #e74c3c;
}

/* Responsive */
@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Animation */
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