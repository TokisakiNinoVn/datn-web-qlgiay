<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Cập nhật Thương hiệu</h2>
        <button @click="close" class="modal-close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <form @submit.prevent="handleUpdate" class="modal-body">
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

        <div class="modal-footer">
          <button type="button" @click="close" class="cancel-btn">
            Hủy
          </button>
          <button type="submit" class="save-btn">
            <i class="fas fa-save mr-2"></i> Cập nhật
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// Props và Emits
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  brand: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close', 'updateBrand']);

// Form Data
const formData = ref({
  id: null,
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
});

// Theo dõi props.brand để cập nhật formData
watch(() => props.brand, (newStaff) => {
  if (newStaff) {
    formData.value = {
      id: newStaff.id || null,
      name: newStaff.name || ''
    };
  } else {
    formData.value = {
      id: null,
      name: ''
    };
  }
}, { immediate: true });

// Xử lý submit
const handleUpdate = () => {
  const updatedData = {
    id: formData.value.id,
    name: formData.value.name,
  };
  emit('updateBrand', updatedData);
};

// Đóng modal
const close = () => {
  emit('close');
};
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
  background: #f39c12;
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

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 8px;
}

.form-label i {
  color: #3498db;
}

.form-input {
  width: 90%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-input:focus {
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