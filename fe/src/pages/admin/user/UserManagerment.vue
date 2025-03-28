<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h1 class="title">Quản lý Người dùng</h1>
        <div class="search-bar">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm theo tên, điện thoại..."
              class="search-input"
              @keyup.enter="searchCustomer"
            />
          </div>
          <button 
            @click="searchCustomer" 
            :disabled="isMiniLoading"
            class="search-btn"
          >
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <button @click="resetFilters" class="reset-btn">
          <i class="fas fa-sync-alt mr-2"></i> Làm mới
        </button>
        <button v-if="roleUser.code == 'admin'" @click="filterByRole('admin')" :class="{ 'active': selectedRole === 'admin' }" class="filter-btn">
          <i class="fas fa-user-tie mr-2"></i> Admin
        </button>
        <button @click="filterByRole('manager')" :class="{ 'active': selectedRole === 'manager' }" class="filter-btn">
          <i class="fas fa-user mr-2"></i> Quản lý kho
        </button>
        <button @click="filterByRole('staff')" :class="{ 'active': selectedRole === 'staff' }" class="filter-btn">
          <i class="fas fa-user mr-2"></i> Nhân viên kho
        </button>
        <button v-if="roleUser.code == 'admin'" @click="showAddForm" class="add-btn">
          <i class="fas fa-plus mr-2"></i> Thêm người dùng
        </button>
        <button v-else @click="showAddForm" class="add-btn">
          <i class="fas fa-plus mr-2"></i> Thêm nhân viên
        </button>
        <div v-if="roleUser.code === 'admin'" class="filter-item">
          <label>Kho hàng</label>
          <select v-model="selectedWarehouseId" @change="applyFiltersAndSearch" class="filter-select">
            <option :value="null">Tất cả</option>
            <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table v-if="filteredCustomers.length > 0" class="user-table">
          <thead>
            <tr class="table-header">
              <th class="table-cell">STT</th>
              <th class="table-cell">Họ và tên</th>
              <th class="table-cell">Chức vụ</th>
              <th class="table-cell">Điện thoại</th>
              <th class="table-cell">Địa chỉ</th>
              <!-- <th v-if="roleUser.code === 'admin'" class="table-cell">Kho</th> -->
              <th class="table-cell">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredCustomers" :key="user.id" class="table-row">
              <td class="table-cell">{{ index + 1 }}</td>
              <td class="table-cell">{{ user.full_name || 'Chưa có thông tin' }}</td>
              <td class="table-cell">{{ user.role || 'Chưa có thông tin' }}</td>
              <td class="table-cell">{{ user.phone || 'Chưa có thông tin' }}</td>
              <td class="table-cell">{{ user.address || 'Chưa có thông tin' }}</td>
              <!-- <td v-if="roleUser.code === 'admin'" class="table-cell">{{ getWarehouseNames(user.warehouses) }}</td> -->
              <td class="table-cell action-cell">
                <button 
                  @click="viewCustomer(user)" 
                  class="action-btn view"
                  title="Xem chi tiết"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  class="action-btn edit"
                  title="Cập nhật"
                >
                  <router-link :to="`/update-user/${user.id}`">
                    <i class="fas fa-edit"></i>
                  </router-link>
                </button>
                <button 
                  @click="removeCustomer(user.id)" 
                  class="action-btn delete"
                  title="Xóa"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else-if="isMiniLoading" class="loading">
          <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải...
        </div>
        <div v-else class="no-data">
          <i class="fas fa-users-slash mr-2"></i> Không có dữ liệu người dùng
        </div>
      </div>

      <!-- Modals -->
      <CustomerDetail :user="customerDetail" :visible="showDetail" @close="closeDetail" />
      <CustomerAdd :show="showAddModal" @close="closeAddModal" @addCustomer="addCustomer" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, createApp } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import CustomerDetail from './DetailUser.vue';
import CustomerAdd from './AddUser.vue';
import { getAllUserSimpleApi, addUserApi, removeUserApi, getUserByIdApi } from '@/services/modules/user.api';
import { getListSimpleWarehouseApi } from '@/services/modules/warehouse.api';
import NotificationComponent from '@/components/NotificationComponent.vue';

const roleUser = JSON.parse(localStorage.getItem('roles')) || { code: '' };
const dataUser = JSON.parse(localStorage.getItem('user')) || { warehouses: [] };

const users = ref([]);
const originalCustomers = ref([]);
const warehouses = ref([]);
const selectedWarehouseId = ref(null);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const selectedRole = ref(null);
const showDetail = ref(false);
const customerDetail = ref(null);
const showAddModal = ref(false);

onBeforeMount(() => {
  fetchCustomers();
  fetchWarehouse();
});

const fetchCustomers = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllUserSimpleApi();
    const data = Array.isArray(response.data) ? response.data : [];
    users.value = data;
    originalCustomers.value = [...data];
    if ((dataUser.warehouses.length === 0 && roleUser.code === 'admin') || (dataUser.warehouses.length !== 0 && roleUser.code !== 'admin')) {
      const response = await getAllUserSimpleApi();
      const data = Array.isArray(response.data) ? response.data : [];
      users.value = data;
      originalCustomers.value = [...data];
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
  }
};

const fetchWarehouse = async () => {
  try {
    const response = await getListSimpleWarehouseApi();
    warehouses.value = response.data.data ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching warehouse:', error);
    showNotification(`Có lỗi xảy ra khi lấy danh sách kho hàng: ${error}`, 'error');
    warehouses.value = [];
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedRole.value = null;
  selectedWarehouseId.value = null;
  applyFiltersAndSearch();
};

const filterByRole = (roleCode) => {
  selectedRole.value = roleCode === selectedRole.value ? null : roleCode;
  applyFiltersAndSearch();
};

const applyFiltersAndSearch = () => {
  let filtered = [...originalCustomers.value];
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role_code === selectedRole.value);
  }

  if (roleUser.code === 'admin' && selectedWarehouseId.value) {
    filtered = filtered.filter(user => Number(user.warehouse_id) === Number(selectedWarehouseId.value));
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => (
      user.full_name?.toLowerCase().includes(query) ||
      user.address?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
    ));
  }
  
  users.value = filtered;
  if (!filtered.length && (searchQuery.value || selectedRole.value || selectedWarehouseId.value)) {
    showNotification('Không tìm thấy người dùng nào.', 'error');
  }
};

const searchCustomer = () => {
  applyFiltersAndSearch();
};

// const getWarehouseNames = (warehouseIds) => {
//   if (!warehouseIds || warehouseIds.length === 0) return 'Không xác định';
//   const names = warehouseIds.map(id => {
//     const warehouse = warehouses.value.find(w => w.id === id);
//     return warehouse ? warehouse.name : 'Không xác định';
//   });
//   return names.join(', ');
// };

const removeCustomer = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    try {
      await removeUserApi(id);
      users.value = users.value.filter(c => c.id !== id);
      originalCustomers.value = originalCustomers.value.filter(c => c.id !== id);
      showNotification('Xóa người dùng thành công!', 'success');
    } catch (error) {
      console.error('Error removing user:', error);
      showNotification('Có lỗi xảy ra khi xóa người dùng.', 'error');
    }
  }
};

const viewCustomer = async (user) => {
  try {
    const response = await getUserByIdApi(user.id);
    customerDetail.value = response.data || null;
    showDetail.value = true;
  } catch (error) {
    console.error('Error fetching user details:', error);
    showNotification(`Có lỗi xảy ra khi xem chi tiết: ${error}`, 'error');
  }
};

const closeDetail = () => {
  showDetail.value = false;
  customerDetail.value = null;
};

const addCustomer = async (customerData) => {
  try {
    const response = await addUserApi(customerData);
    if (response.data.code === 400) {
      showNotification(`Thêm người dùng không thành công!: ${response.data.message}`, 'error');
      return;
    }
    showNotification('Thêm người dùng thành công!', 'success');
    fetchCustomers();
    closeAddModal();
  } catch (error) {
    console.error('Error adding user:', error);
    showNotification(`Có lỗi xảy ra khi thêm người dùng: ${error}`, 'error');
  }
};

const showAddForm = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const filteredCustomers = computed(() => users.value.map((user, index) => ({ ...user, index })));

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
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #fff;
  font-weight: 700;
  margin: 0;
}

.search-bar {
  display: flex;
  gap: 1rem;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 80%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-btn:hover {
  background: #0056b3;
}

.search-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.reset-btn, .filter-btn, .add-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #5a6268;
}

.filter-btn {
  background: #e9ecef;
  color: #343a40;
}

.filter-btn:hover, .filter-btn.active {
  background: #007bff;
  color: white;
}

.add-btn {
  background: #28a745;
  color: white;
}

.add-btn:hover {
  background: #218838;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-item label {
  font-size: 1rem;
  color: #343a40;
  font-weight: 500;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.filter-select:focus {
  border-color: #007bff;
  outline: none;
}

.table-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header th {
  font-size: 1rem;
  font-weight: 600;
  color: #343a40;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  text-align: left;
}

.table-row td {
  padding: 1rem;
  font-size: 1rem;
  color: #343a40;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.table-row:hover {
  background: #f1f3f5;
}

.action-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.view {
  background: #17a2b8;
  color: white;
}

.view:hover {
  background: #138496;
}

.edit {
  background: #ffc107;
  color: #343a40;
}

.edit:hover {
  background: #e0a800;
}

.delete {
  background: #dc3545;
  color: white;
}

.delete:hover {
  background: #c82333;
}

.loading, .no-data {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
}
</style>