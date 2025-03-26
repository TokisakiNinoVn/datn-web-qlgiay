<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Thêm Thương hiệu</h2>
        <button @click="close" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <form @submit.prevent="handleAdd" class="modal-body">
        <div class="form-group">
          <label for="name" class="form-label">
            <i class="fas fa-building mr-2"></i> Tên thương hiệu
          </label>
          <input
            v-model="formData.name"
            type="text"
            id="name"
            placeholder="Nhập tên thương hiệu"
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
          <button type="submit" class="save-btn">
            <i class="fas fa-plus mr-2"></i> Thêm thương hiệu
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { getListSimpleWarehouseApi } from '@/services/modules/warehouse.api';
import { addBrandApi } from '@/services/modules/brand.api';

const roleUser = JSON.parse(localStorage.getItem('roles')) || { code: '' };
const warehouses = ref([]);

// Props và Emits
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'addBrand']);

// Form Data
const formData = ref({
  name: '',
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

// Xử lý thêm thương hiệu
const handleAdd = async () => {
  try {
    const brandData = { ...formData.value };
    if (roleUser.code !== 'admin') {
      delete brandData.warehouse_id;
    }
    const response = await addBrandApi(brandData);
    emit('addBrand', response.data);
    alert('Thêm thương hiệu thành công!');
    resetForm();
    close();
  } catch (error) {
    console.error('Lỗi khi thêm thương hiệu:', error);
    alert('Thêm thương hiệu thất bại!');
  }
};

// Reset form sau khi submit
const resetForm = () => {
  formData.value = {
    name: '',
    warehouse_id: '',
  };
};

// Đóng modal
const close = () => {
  emit('close');
};

// Khởi tạo dữ liệu khi mounted
onMounted(() => {
  fetchWarehouse();
});
</script>

<style scoped>
i {
  margin-right: 8px;
}

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
  background: #27ae60;
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

.form-label {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
}

.form-label i {
  color: #3498db;
}

.form-input, .form-select {
  width: 80%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-input:focus, .form-select:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

/* Modal Footer */
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
  background: #27ae60;
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
  background: #219653;
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