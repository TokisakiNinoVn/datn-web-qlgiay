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
        <button @click="filterByRole('admin')" :class="{ 'active': selectedRole === 'admin' }" class="filter-btn">
          <i class="fas fa-user-tie mr-2"></i> Admin
        </button>
        <button @click="filterByRole('manager')" :class="{ 'active': selectedRole === 'manager' }" class="filter-btn">
          <i class="fas fa-user mr-2"></i> Quản lý kho
        </button>
        <button @click="filterByRole('staff')" :class="{ 'active': selectedRole === 'staff' }" class="filter-btn">
          <i class="fas fa-user mr-2"></i> Nhân viên kho
        </button>
        <button @click="showAddForm" class="add-btn">
          <i class="fas fa-plus mr-2"></i> Thêm người dùng
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table v-if="filteredCustomers.length > 0" class="user-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Chức vụ</th>
              <th>Điện thoại</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in filteredCustomers" :key="user.id">
              <td>{{ index + 1 }}</td>
              <td>{{ user.full_name || 'Chưa có thông tin' }}</td>
              <td>{{ user.role || 'Chưa có thông tin' }}</td>
              <td>{{ user.phone || 'Chưa có thông tin' }}</td>
              <td>{{ user.address || 'Chưa có thông tin' }}</td>
              <td class="actions">
                <button 
                  @click="viewCustomer(user)" 
                  class="action-btn view"
                  title="Xem chi tiết"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  @click="showUpdateForm(user)" 
                  class="action-btn edit"
                  title="Cập nhật"
                >
                  <i class="fas fa-edit"></i>
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
      <CustomerUpdate :show="showUpdateModal" :user="selectedCustomer" @close="closeUpdateModal" @updateCustomer="updateCustomer" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import CustomerDetail from './DetailUser.vue';
import CustomerAdd from './AddUser.vue';
import CustomerUpdate from './UpdateUser.vue';
import { getAllUserSimpleApi, addUserApi, updateUserApi, removeUserApi, getUserByIdApi } from '@/services/modules/user.api';
// import { getUserAllApi, addUserApi, updateUserApi, removeUserApi, getUserByIdApi } from '@/services/modules/user.api';

const users = ref([]);
const originalCustomers = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const selectedRole = ref(null);
const showDetail = ref(false);
const customerDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedCustomer = ref(null);

onBeforeMount(() => {
  fetchCustomers();
});

const fetchCustomers = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllUserSimpleApi();
    // const response = await getUserAllApi();
    const data = Array.isArray(response.data) ? response.data : [];
    users.value = data;
    originalCustomers.value = [...data];
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
    originalCustomers.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedRole.value = null;
  users.value = [...originalCustomers.value];
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

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(user => (
      user.full_name?.toLowerCase().includes(query) ||
      user.address?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
    )
    );
  }

  users.value = filtered;
  if (!filtered.length && searchQuery.value) {
    alert('Không tìm thấy người dùng nào.');
  }
};

const searchCustomer = () => {
  applyFiltersAndSearch();
};

const removeCustomer = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    try {
      await removeUserApi(id);
      users.value = users.value.filter(c => c.id !== id);
      originalCustomers.value = originalCustomers.value.filter(c => c.id !== id);
      alert('Xóa người dùng thành công!');
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Có lỗi xảy ra khi xóa người dùng.');
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
    alert('Có lỗi xảy ra khi xem chi tiết.');
  }
};

const closeDetail = () => {
  showDetail.value = false;
  customerDetail.value = null;
};

const addCustomer = async (customerData) => {
  try {
    await addUserApi(customerData);
    alert('Thêm người dùng thành công!');
    fetchCustomers();
    closeAddModal();
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Có lỗi xảy ra khi thêm người dùng.');
  }
};

const showAddForm = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const showUpdateForm = (user) => {
  selectedCustomer.value = { ...user };
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

const updateCustomer = async (updatedData) => {
  try {
    const response = await getUserByIdApi(updatedData.id);
    // eslint-disable-next-line no-unused-vars
    const data = response.data || {};
    await updateUserApi(updatedData.id, updatedData);
    alert('Cập nhật người dùng thành công!');
    fetchCustomers();
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Có lỗi xảy ra khi cập nhật người dùng.');
  }
};

const filteredCustomers = computed(() => users.value.map((user, index) => ({ ...user, index })));
</script>

<style scoped>
.toolbar i {
  margin-right: 0.5rem;
}
/* General Styles */
.container {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e8ecef;
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;
}

.search-bar {
  display: flex;
  gap: 1rem;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

.search-input {
  width: 80%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background 0.3s;
}

.search-btn:hover:not(:disabled) {
  background: #2980b9;
}

.search-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

/* Toolbar */
.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.reset-btn, .add-btn, .filter-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  color: white;
  display: flex;
  align-items: center;
  transition: background 0.3s;
  font-weight: 500;
}

.reset-btn {
  background: #95a5a6;
}

.reset-btn:hover {
  background: #7f8c8d;
}

.filter-btn {
  background: #34495e;
}

.filter-btn:hover {
  background: #2c3e50;
}

.filter-btn.active {
  background: #e67e22;
}

.add-btn {
  background: #2ecc71;
}

.add-btn:hover {
  background: #27ae60;
}

/* Table */
.table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th, .user-table td {
  padding: 1rem;
  text-align: center;
}

.user-table th {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 2px solid #e8ecef;
}

.user-table td {
  color: #636e72;
  font-size: 14px;
  border-bottom: 1px solid #e8ecef;
}

.user-table tr:hover {
  background: #f8f9fa;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s;
}

.action-btn i {
  font-size: 1.1rem;
}

.edit { color: #f1c40f; }
.edit:hover { background: #f1c40f; color: white; }

.view { color: #3498db; }
.view:hover { background: #3498db; color: white; }

.delete { color: #e74c3c; }
.delete:hover { background: #e74c3c; color: white; }

/* Loading and No Data */
.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>