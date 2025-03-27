<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h1 class="title">Quản lý Danh mục</h1>
        <div class="stats">
          <span>Tổng: {{ filteredCategories.length }} danh mục</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="search-add">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tên danh mục..."
              class="search-input"
            />
          </div>
          <button @click="showAddForm" class="add-btn">
            <i class="fas fa-plus mr-2"></i> Thêm danh mục
          </button>
        </div>
        <div v-if="roleUser.code === 'admin'" class="filter-item">
          <label class="filter-label">Kho hàng</label>
          <select v-model="selectedWarehouseId" @change="applyFilters" class="filter-select">
            <option :value="null">Tất cả</option>
            <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
          </select>
        </div>
      </div>

      <!-- Category Table -->
      <div class="category-table-wrapper">
        <table class="category-table">
          <thead>
            <tr class="table-header">
              <th class="table-cell">STT</th>
              <th class="table-cell">Tên danh mục</th>
              <th v-if="roleUser.code === 'admin'" class="table-cell">Kho</th>
              <th class="table-cell">Số lượng sản phẩm</th>
              <th class="table-cell">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(category, index) in filteredCategories"
              :key="category.id"
              class="table-row"
            >
              <td class="table-cell">{{ index + 1 }}</td>
              <td class="table-cell">{{ category.name }}</td>
              <td v-if="roleUser.code === 'admin'" class="table-cell">{{ getWarehouseName(category.warehouse_id) }}</td>
              <td class="table-cell">{{ category.total_products || 0 }}</td>
              <td class="table-cell action-cell">
                <button @click.stop="viewCategory(category)" class="action-btn view-btn" title="Xem chi tiết">
                  <i class="fas fa-eye"></i>
                </button>
                <button @click.stop="showUpdateForm(category)" class="action-btn edit-btn" title="Chỉnh sửa">
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button @click.stop="removeCategory(category.id)" class="action-btn delete-btn" title="Xóa">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="isMiniLoading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-if="!isMiniLoading && filteredCategories.length === 0" class="no-results">
          Không tìm thấy danh mục nào.
        </div>
      </div>

      <!-- Modals -->
      <CategoryDetail :category="categoryDetail" :visible="showDetail" @close="closeDetail" />
      <CategoryAdd :show="showAddModal" @close="closeAddModal" @addCategory="addCategory" />
      <CategoryUpdate
        :show="showUpdateModal"
        :category="selectedCategory"
        @close="closeUpdateModal"
        @updateCategory="updateCategory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, createApp } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import CategoryDetail from './DetailCategory.vue';
import CategoryAdd from './AddCategory.vue';
import CategoryUpdate from './UpdateCategory.vue';
import {
  getAllCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from '@/services/modules/category.api';
import { getListSimpleWarehouseApi } from '@/services/modules/warehouse.api';
import NotificationComponent from '@/components/NotificationComponent.vue';

const categories = ref([]);
const warehouses = ref([]);
const roleUser = JSON.parse(localStorage.getItem('roles')) || { code: '' };
const selectedWarehouseId = ref(null);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const showDetail = ref(false);
const categoryDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedCategory = ref(null);
const idAdminLogin = ref(null);

onBeforeMount(() => {
  fetchCategories();
  fetchWarehouse();
  const userInfor = localStorage.getItem('user');
  if (userInfor) {
    const user = JSON.parse(userInfor);
    idAdminLogin.value = user.id;
  }
});

const fetchCategories = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllCategoryApi();
    if (Array.isArray(response.data.data)) {
      categories.value = response.data.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    categories.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

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

const filteredCategories = computed(() => {
  let filtered = categories.value;
  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(category =>
      category.name.toLowerCase().includes(query)
    );
  }
  if (roleUser.code === 'admin' && selectedWarehouseId.value) {
    filtered = filtered.filter(category =>
      category.warehouse_id === selectedWarehouseId.value
    );
  }
  return filtered;
});

const getWarehouseName = (warehouseId) => {
  const warehouse = warehouses.value.find(w => w.id === warehouseId);
  return warehouse ? warehouse.name : 'Không xác định';
};

const applyFilters = () => {
  fetchCategories();
};

const showAddForm = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const showUpdateForm = (category) => {
  // console.log(category);
  selectedCategory.value = { ...category };
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  selectedCategory.value = null;
};

const updateCategory = async (updatedCategory) => {
  try {
    updatedCategory.idAdmin = idAdminLogin.value;
    await updateCategoryApi(updatedCategory);
    fetchCategories();
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating category:', error);
    showNotification(`Có lỗi xảy ra khi cập nhật danh mục.`, 'error');
  }
};

const removeCategory = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    try {
      const response = await deleteCategoryApi(id);
      categories.value = categories.value.filter(c => c.id !== id);
      if (response.data.code !== 200) {
        showNotification(`Xóa danh mục không thành công: ${response.data.message}`, 'error');
      } else {
        showNotification('Xóa danh mục thành công!', 'success');
      }
    } catch (error) {
      console.error('Error removing category:', error);
      showNotification(`Có lỗi xảy ra khi xóa danh mục.`, 'error');
    }
  }
};

const viewCategory = (category) => {
  categoryDetail.value = category;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  categoryDetail.value = null;
};

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

.stats {
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-add {
  display: flex;
  gap: 1rem;
  flex: 1;
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

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
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

.add-btn:hover {
  background: #218838;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
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

.category-table-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-table {
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

.view-btn {
  background: #17a2b8;
  color: white;
}

.view-btn:hover {
  background: #138496;
}

.edit-btn {
  background: #ffc107;
  color: #343a40;
}

.edit-btn:hover {
  background: #e0a800;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
}

.no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
}
</style>