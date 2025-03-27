<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Thêm Nhà cung cấp</h2>
        <button @click="close" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <form @submit.prevent="handleAdd" class="modal-body">
        <div class="form-group">
          <label for="name" class="form-label">
            <i class="fas fa-building mr-2"></i> Tên nhà cung cấp
          </label>
          <input
            v-model="formData.name"
            type="text"
            id="name"
            placeholder="Nhập tên nhà cung cấp"
            class="form-input"
            required
          />
        </div>

        <div class="form-group">
          <label for="address" class="form-label">
            <i class="fas fa-map-marker-alt mr-2"></i> Địa chỉ
          </label>
          <input
            v-model="formData.address"
            type="text"
            id="address"
            placeholder="Nhập địa chỉ"
            class="form-input"
            required
          />
        </div>

        <div class="form-group flex-container">
          <div class="flex-item">
            <label for="contact_person" class="form-label">
              <i class="fas fa-user mr-2"></i> Người liên hệ
            </label>
            <input
              v-model="formData.contact_person"
              type="text"
              id="contact_person"
              placeholder="Tên người liên hệ"
              class="form-input"
              required
            />
          </div>
          <div class="flex-item">
            <label for="phone" class="form-label">
              <i class="fas fa-phone mr-2"></i> Số điện thoại
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              id="phone"
              placeholder="Nhập số điện thoại"
              class="form-input"
              pattern="[0-9]{10,11}"
              title="Số điện thoại phải có 10-11 chữ số"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">
            <i class="fas fa-envelope mr-2"></i> Email
          </label>
          <input
            v-model="formData.email"
            type="email"
            id="email"
            placeholder="Nhập email"
            class="form-input"
            required
          />
        </div>

        <div class="form-group" v-if="roleUser.code === 'admin'">
          <label for="warehouse" class="form-label">
            <i class="fas fa-warehouse mr-2"></i> Chọn kho
          </label>
          <select v-model="formData.warehouse_id" id="warehouse" class="form-select" required>
            <option value="" disabled>Chọn kho</option>
            <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
              {{ warehouse.name }}
            </option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" @click="close" class="cancel-btn">
            Hủy
          </button>
          <button type="submit" class="save-btn" :disabled="isSubmitting">
            <i class="fas fa-plus mr-2"></i> Thêm nhà cung cấp
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin ml-2"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, createApp } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { getListSimpleWarehouseApi } from '@/services/modules/warehouse.api';
import { addSupplierApi } from '@/services/modules/supplier.api';
import NotificationComponent from '@/components/NotificationComponent.vue';

const roleUser = JSON.parse(localStorage.getItem('roles')) || { code: '' };
const warehouses = ref([]);
const isSubmitting = ref(false);

// Props và Emits
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'addSupplier']);

// Form Data
const formData = ref({
  name: '',
  address: '',
  contact_person: '',
  phone: '',
  email: '',
  warehouse_id: '',
});

// Lấy danh sách kho
const fetchWarehouse = async () => {
  try {
    const response = await getListSimpleWarehouseApi();
    if (Array.isArray(response.data.data)) {
      warehouses.value = response.data.data;
    } else {
      throw new Error('Dữ liệu kho không phải là một mảng');
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách kho:', error);
    warehouses.value = [];
  }
};

// Xử lý submit
const handleAdd = async () => {
  isSubmitting.value = true;
  try {
    const supplierData = { ...formData.value };

    if (roleUser.code !== 'admin') {
      delete supplierData.warehouse_id; // Xóa warehouse_id nếu không phải admin
    }

    const response = await addSupplierApi(supplierData);

    if (response.data.code === 201) {
      showNotification('Thêm nhà cung cấp thành công!', 'success');
      emit('addSupplier', response.data);
      resetForm();
      close();
    } else {
      showNotification('Thêm nhà cung cấp không thành công!', 'error');
    }
  } catch (error) {
    console.error('Lỗi khi thêm nhà cung cấp:', error);

    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || 'Thêm nhà cung cấp thất bại!';
      showNotification(`Lỗi: ${errorMessage}`, 'error');
    } else {
      showNotification('Lỗi khi thêm nhà cung cấp!', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
};


// Reset form sau khi submit
const resetForm = () => {
  formData.value = {
    name: '',
    address: '',
    contact_person: '',
    phone: '',
    email: '',
    warehouse_id: '',
  };
};

// Đóng modal
const close = () => {
  emit('close');
};

// Khởi tạo dữ liệu khi mounted
onMounted(() => {
  if (roleUser.code === 'admin') {
    fetchWarehouse();
  }
});

const showNotification = (message, type) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp(NotificationComponent, { message, type });
  // eslint-disable-next-line no-unused-vars
  const instance = app.mount(container);
  setTimeout(() => {
    app.unmount();
    document.body.removeChild(container);
  }, 3000);
};
</script>

<style scoped>
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
  background: #28a745;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flex-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.flex-item {
  flex: 1;
  min-width: 200px;
}

.form-label {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
}

.form-label i {
  color: #3498db;
  margin-right: 8px;
}

.form-input,
.form-select {
  width: 90%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

.modal-footer {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  background: #ecf0f1;
  color: #2c3e50;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background: #dfe6e9;
}

.save-btn {
  background: #28a745;
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

.save-btn:hover {
  background: #218838;
}

.save-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
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