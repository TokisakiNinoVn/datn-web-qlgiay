<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h2 class="title">Cập nhật thông tin người dùng</h2>
        <router-link to="/user-management" class="close-btn">
          <i class="fas fa-times"></i>
        </router-link>
      </div>

      <form @submit.prevent="handleUpdate" class="form-container">
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
              disabled
            />
          </div>

          <!-- <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock mr-2"></i> Mật khẩu
            </label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)"
              class="form-input"
            />
          </div> -->

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
            <select v-model="formData.role" class="form-select" required @change="handleRoleChange">
              <option value="" disabled>Chọn vai trò</option>
              <option v-if="roleUser.code === 'admin'" value="Quản trị viên">Quản trị viên</option>
              <option v-if="roleUser.code === 'admin'" value="Quản lý kho">Quản lý kho</option>
              <option value="Nhân viên kho">Nhân viên kho</option>
            </select>
          </div>

          <div class="form-group" v-if="shouldShowWarehouse && roleUser.code === 'admin'">
            <label class="form-label">
              <i class="fas fa-warehouse mr-2"></i> Chọn kho làm việc
            </label>
            <select v-model="formData.warehouse_id" class="form-select" required>
              <option value="" disabled>Chọn kho làm việc</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </select>
          </div>
          <div class="form-group" v-else>
            <label class="form-label">
              <i class="fas fa-warehouse mr-2"></i> Kho
            </label>
            <input
              type="text"
              class="form-input"
              :value="warehouseName"
              disabled
            />
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
            <textarea
              v-model="formData.note"
              placeholder="Nhập ghi chú (không bắt buộc)"
              class="form-input textarea"
            ></textarea>
          </div>
        </div>

        <div class="form-actions">
          <router-link to="/management-user" class="cancel-btn">
            <i class="fas fa-times mr-2"></i> Hủy
          </router-link>
          <button type="submit" class="submit-btn">
            <i class="fas fa-save mr-2"></i> Cập nhật
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, createApp } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/NavbarComponent.vue';
import { getListSimpleWarehouseApi } from '@/services/modules/warehouse.api';
import { getUserByIdApi, updateUserApi } from '@/services/modules/user.api';
import NotificationComponent from '@/components/NotificationComponent.vue';

const route = useRoute();
const router = useRouter();
const roleUser = JSON.parse(localStorage.getItem('roles')) || { code: '' };
const dataUser = JSON.parse(localStorage.getItem('user')) || {};
const userId = route.params.id;

const formData = ref({
  full_name: '',
  phone: '',
  address: '',
  gender: null,
  email: '',
  note: '',
  role: '',
  role_code: '',
  warehouse_id: '',
});

const warehouses = ref([]);

onMounted(async () => {
  await fetchWarehouse();
  await fetchUserData();
});

const fetchWarehouse = async () => {
  try {
    const response = await getListSimpleWarehouseApi();
    warehouses.value = response.data.data || [];
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    showNotification('Lỗi khi tải danh sách kho!', 'error');
    warehouses.value = [];
  }
};

const fetchUserData = async () => {
  try {
    const response = await getUserByIdApi(userId);
    const userData = response.data;
    formData.value = {
      full_name: userData.full_name || '',
      phone: userData.phone || '',
      address: userData.address || '',
      gender: userData.gender || null,
      email: userData.email || '',
      note: userData.note || '',
      role: userData.role || 'Nhân viên kho',
      warehouse_id: userData.warehouse_id || dataUser.warehouses?.[0]?.id || '',
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    showNotification('Lỗi khi tải thông tin người dùng!', 'error');
  }
};

const shouldShowWarehouse = computed(() => 
  formData.value.role === 'Quản lý kho' || formData.value.role === 'Nhân viên kho'
);

const handleRoleChange = () => {
  if (formData.value.role === 'Quản trị viên') {
    formData.value.warehouse_id = '';
    formData.value.role_code = 'admin';
  } else if (formData.value.role === 'Quản lý kho') {
    formData.value.role_code = 'manager';
  } else {
    formData.value.role_code = 'staff';
  }
};

const handleUpdate = async () => {
  try {
    const updateData = { ...formData.value, id: userId };
    const response = await updateUserApi(userId, updateData);
    if (response.status !== 200) {
      // alert('Cập nhật thông tin thất bại!');
      showNotification('Cập nhật thông tin thất bại!', 'error');
      return;
    }
    showNotification('Cập nhật thông tin người dùng thành công!', 'success');
    // alert('Cập nhật thông tin người dùng thành công!');
    router.push('/management-user');
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Cập nhật thông tin thất bại!');
  }
};

const warehouseName = computed(() => {
  const warehouse = warehouses.value.find(w => w.id === formData.value.warehouse_id);
  return warehouse ? warehouse.name : 'Không xác định';
});

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
</script>

<style scoped>
i {
  font-size: 1rem;
  margin-right: 0.5rem;
}
.container {
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
}

.main-content {
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  color: #fff;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.form-container {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.form-input, .form-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus {
  border-color: #007bff;
  outline: none;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.form-input:disabled {
  background: #f8f9fa;
  color: #6c757d;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
}

.cancel-btn {
  background: #6c757d;
}

.cancel-btn:hover {
  background: #5a6268;
}

.submit-btn {
  background: #007bff;
}

.submit-btn:hover {
  background: #0056b3;
}
</style>