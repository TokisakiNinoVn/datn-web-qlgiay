<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h1 class="title">Quản lý Thương hiệu</h1>
        <div class="stats">
          <span>Tổng: {{ filteredBrands.length }} thương hiệu</span>
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
              placeholder="Tìm kiếm theo tên thương hiệu..."
              class="search-input"
            />
          </div>
          <button @click="showAddForm" class="add-btn">
            <i class="fas fa-plus mr-2"></i> Thêm thương hiệu
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

      <!-- Brand Table -->
      <div class="brand-table-wrapper">
        <div class="table-grid">
          <div class="table-header">
            <div class="table-cell">STT</div>
            <div class="table-cell">Tên thương hiệu</div>
            <div class="table-cell">Số lượng sản phẩm</div>
            <div class="table-cell">Hành động</div>
          </div>
          <div
            v-for="(brand, index) in paginatedBrands"
            :key="brand.id"
            class="table-row"
          >
            <div class="table-cell">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
            <div class="table-cell">{{ brand.name }}</div>
            <div class="table-cell">{{ brand.total_products || 0 }}</div>
            <div class="table-cell action-cell">
              <button @click.stop="viewBrand(brand)" class="action-btn view-btn" title="Xem chi tiết">
                <i class="fas fa-eye"></i>
              </button>
              <button @click.stop="showUpdateForm(brand)" class="action-btn edit-btn" title="Chỉnh sửa">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button @click.stop="removeBrand(brand.id)" class="action-btn delete-btn" title="Xóa">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-if="isMiniLoading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Đang tải...
        </div>
        <div v-if="!isMiniLoading && filteredBrands.length === 0" class="no-results">
          Không tìm thấy thương hiệu nào.
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="filteredBrands.length > itemsPerPage">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="pagination-info">
            Trang {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Modals -->
      <BrandDetail :brand="brandDetail" :visible="showDetail" @close="closeDetail" />
      <BrandAdd :show="showAddModal" @close="closeAddModal" @addBrand="addBrand" />
      <BrandUpdate
        :show="showUpdateModal"
        :brand="selectedBrand"
        @close="closeUpdateModal"
        @updateBrand="updateBrand"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import BrandDetail from './DetailBrand.vue';
import BrandAdd from './AddBrand.vue';
import BrandUpdate from './UpdateBrand.vue';
import {
  getAllBrandApi,
  deleteBrandApi,
} from '@/services/modules/brand.api';
import { getListSimpleWarehouseApi } from '@/services/modules/warehouse.api';

const brands = ref([]);
const roleUser = JSON.parse(localStorage.getItem('roles')) || { code: '' };
const warehouses = ref([]);

const selectedWarehouseId = ref(null);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const showDetail = ref(false);
const brandDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedBrand = ref(null);
const idAdminLogin = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

onBeforeMount(() => {
  fetchBrands();
  if (roleUser.code === 'admin') {
    fetchWarehouse();
  }
  const userInfor = localStorage.getItem('user');
  if (userInfor) {
    const user = JSON.parse(userInfor);
    idAdminLogin.value = user.id;
  }
});

const fetchBrands = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllBrandApi();
    if (Array.isArray(response.data.data)) {
      brands.value = response.data.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching brands:', error);
    brands.value = [];
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

const filteredBrands = computed(() => {
  let filtered = brands.value;
  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    filtered = filtered.filter(brand =>
      brand.name.toLowerCase().includes(query)
    );
  }
  if (roleUser.code === 'admin' && selectedWarehouseId.value) {
    filtered = filtered.filter(brand =>
      brand.warehouse_id === selectedWarehouseId.value
    );
  }
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredBrands.value.length / itemsPerPage));
const paginatedBrands = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBrands.value.slice(start, end);
});

const applyFilters = () => {
  currentPage.value = 1; // Reset về trang đầu khi lọc
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const showAddForm = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const addBrand = (newBrand) => {
  brands.value.push(newBrand);
  closeAddModal();
};

const showUpdateForm = (brand) => {
  console.log('brand:', brand);
  selectedBrand.value = { ...brand };
  showUpdateModal.value = true;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  selectedBrand.value = null;
};

const updateBrand = (updatedBrand) => {
  const index = brands.value.findIndex(b => b.id === updatedBrand.id);
  if (index !== -1) {
    brands.value[index] = { ...updatedBrand };
  }
  closeUpdateModal();
};

const removeBrand = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
    try {
      await deleteBrandApi(id);
      brands.value = brands.value.filter(b => b.id !== id);
      alert('Xóa thương hiệu thành công!');
    } catch (error) {
      console.error('Error removing brand:', error);
      alert('Có lỗi xảy ra khi xóa thương hiệu.');
    }
  }
};

const viewBrand = (brand) => {
  brandDetail.value = brand;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  brandDetail.value = null;
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

.brand-table-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.table-grid {
  display: grid;
  grid-template-columns: 1fr 3fr 2fr 2fr;
  gap: 1rem;
}

.table-header {
  display: contents;
}

.table-header .table-cell {
  font-size: 1rem;
  font-weight: 600;
  color: #343a40;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 2px solid #ddd;
}

.table-row {
  display: contents;
}

.table-row:hover .table-cell {
  background: #f1f3f5;
}

.table-cell {
  padding: 1rem;
  font-size: 1rem;
  color: #343a40;
  border-bottom: 1px solid #e9ecef;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.pagination-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background: #0056b3;
}

.pagination-info {
  font-size: 1rem;
  color: #343a40;
}
</style>