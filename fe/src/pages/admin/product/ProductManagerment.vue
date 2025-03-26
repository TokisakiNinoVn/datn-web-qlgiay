<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Quản lý sản phẩm</h1>
        <div class="header-actions">
          <router-link to="/add-product" class="add-btn">
            <i class="fas fa-plus mr-2"></i> Thêm sản phẩm
          </router-link>
        </div>
      </div>

      <!-- Filters and Toolbar -->
      <div class="control-panel">
        <div class="filters">
          <div class="filter-item">
            <label>Tìm kiếm</label>
            <div class="search-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm tên sản phẩm..."
                class="search-input"
                @keyup.enter="searchProduct"
              />
            </div>
          </div>
          <div v-if="roleUser.code === 'admin'" class="filter-item">
            <label>Kho hàng</label>
            <select v-model="selectedWarehouseId" @change="applyFiltersAndSearch">
              <option :value="null">Tất cả</option>
              <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Thương hiệu</label>
            <select v-model="selectedBrandId" @change="applyFiltersAndSearch">
              <option :value="null">Tất cả</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Danh mục</label>
            <select v-model="selectedCategoryId" @change="applyFiltersAndSearch">
              <option :value="null">Tất cả</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Nhà cung cấp</label>
            <select v-model="selectedSupplierId" @change="applyFiltersAndSearch">
              <option :value="null">Tất cả</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
            </select>
          </div>
        </div>

        <div class="toolbar">
          <button @click="filterByStatus(1)" :class="{ 'active': selectedStatus === 1 }" class="filter-btn">
            <i class="fas fa-check-circle mr-2"></i> Còn hàng
          </button>
          <button @click="filterByStatus(2)" :class="{ 'active': selectedStatus === 2 }" class="filter-btn">
            <i class="fas fa-exclamation-circle mr-2"></i> Sắp hết hàng
          </button>
          <button @click="filterByStatus(0)" :class="{ 'active': selectedStatus === 0 }" class="filter-btn">
            <i class="fas fa-times-circle mr-2"></i> Hết hàng
          </button>
          <button @click="resetFilters" class="reset-btn">
            <i class="fas fa-undo mr-2"></i> Reset Filter
          </button>

          <div class="pagination-options">
            <label>Hiển thị</label>
            <select v-model="itemsPerPage" @change="changeItemsPerPage">
              <option :value="10">10</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>

          <div>
            <button @click="exportToExcel" style="">Xuất Excel</button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table v-if="paginatedProducts.length > 0" class="product-table">
          <thead>
            <tr>
              <th class="stt">STT</th>
              <th class="image">Ảnh</th>
              <th class="product-name">Tên sản phẩm</th>
              <th class="price">Giá (VNĐ)</th>
              <th class="stock">Số lượng</th>
              <th class="brand">Thương hiệu</th>
              <th class="actions-col">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in paginatedProducts" :key="product.id">
              <td class="stt">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="image">
                <img
                  :src="instance.defaults.baseURL + product.image_url"
                  alt="Product Image"
                  class="product-image"
                  @click="showFullImage(product.image_url)"
                />
              </td>
              <td class="product-name">{{ product.product_name }}</td>
              <td class="price">{{ formatCurrency(product.price) }}</td>
              <td class="stock">{{ product.stock_quantity }}</td>
              <td class="brand">{{ product.brand_name }}</td>
              <td class="actions-col actions">
                <button class="action-btn view" title="Xem chi tiết">
                  <router-link :to="`/details-product/${product.id}`"><i class="fas fa-eye"></i></router-link>
                </button>
                <button class="action-btn edit" title="Cập nhật">
                  <router-link :to="`/edit-product/${product.id}`"><i class="fas fa-edit"></i></router-link>
                </button>
                <button @click="removeProduct(product.id)" class="action-btn delete" title="Xóa">
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
          <i class="fas fa-box-open mr-2"></i> Không có dữ liệu sản phẩm
        </div>

        <!-- Enhanced Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button @click="goToFirstPage" :disabled="currentPage === 1" class="page-btn">
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="{ 'page-btn': true, 'active': currentPage === page }"
          >
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
          <button @click="goToLastPage" :disabled="currentPage === totalPages" class="page-btn">
            <i class="fas fa-angle-double-right"></i>
          </button>
          <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
        </div>
      </div>

      <!-- Full Image Modal -->
      <div v-if="showImageModal" class="image-modal">
        <div class="image-modal-content">
          <img :src="fullImageUrl" alt="Full Product Image" class="full-image" />
          <button @click="closeFullImage" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import { getAllProductApi, deleteProductApi } from '@/services/modules/product.api';
import { getForAddApi } from '@/services/modules/product.api';
import instance from '@/services/axiosConfig';
import * as XLSX from "xlsx";
// import FileSaver from "file-saver";

const roleUser = JSON.parse(localStorage.getItem('roles'));

const products = ref([]);
const originalProducts = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const selectedStatus = ref(null);
const selectedWarehouseId = ref(null);
const selectedBrandId = ref(null);
const selectedCategoryId = ref(null);
const selectedSupplierId = ref(null);

const brands = ref([]);
const categories = ref([]);
const suppliers = ref([]);
const warehouses = ref([]);

const itemsPerPage = ref(10);
const currentPage = ref(1);

const showImageModal = ref(false);
const fullImageUrl = ref('');

onBeforeMount(() => {
  fetchProducts();
  fetchFilter();
});

const fetchProducts = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllProductApi();
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    products.value = data;
    originalProducts.value = [...data];
  } catch (error) {
    console.error('Error fetching products:', error);
    products.value = [];
    originalProducts.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

const fetchFilter = async () => {
  try {
    const response = await getForAddApi();
    const data = response.data.data;
    brands.value = data.brands;
    categories.value = data.categories;
    suppliers.value = data.suppliers;
    warehouses.value = data.warehouses;
  } catch (error) {
    console.error('Error fetching filter data:', error);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(parseFloat(value));
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = null;
  selectedWarehouseId.value = null;
  selectedBrandId.value = null;
  selectedCategoryId.value = null;
  selectedSupplierId.value = null;
  currentPage.value = 1;
  applyFiltersAndSearch();
};

const filterByStatus = (status) => {
  selectedStatus.value = status;
  if (status === 0) {
    products.value = originalProducts.value.filter(product => product.stock_quantity === 0);
  } else if (status === 1) {
    products.value = originalProducts.value.filter(product => product.stock_quantity > 10);
  } else if (status === 2) {
    products.value = originalProducts.value.filter(product => product.stock_quantity > 0 && product.stock_quantity <= 10);
  }
};

const applyFiltersAndSearch = () => {
  let filtered = [...originalProducts.value];

  if (selectedStatus.value !== null) {
    filtered = filtered.filter(product => product.status === selectedStatus.value);
  }

  if (selectedWarehouseId.value) {
    filtered = filtered.filter(product => product.warehouse_name === warehouses.value.find(w => w.id === selectedWarehouseId.value)?.name);
  }

  if (selectedBrandId.value) {
    filtered = filtered.filter(product => product.brand_name === brands.value.find(b => b.id === selectedBrandId.value)?.name);
  }

  if (selectedCategoryId.value) {
    filtered = filtered.filter(product => product.category_name === categories.value.find(c => c.id === selectedCategoryId.value)?.name);
  }

  if (selectedSupplierId.value) {
    filtered = filtered.filter(product => product.supplier_name === suppliers.value.find(s => s.id === selectedSupplierId.value)?.name);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(product =>
      product.product_name.toLowerCase().includes(query) ||
      product.brand_name.toLowerCase().includes(query)
    );
  }

  products.value = filtered;
  if (!filtered.length && (searchQuery.value || selectedStatus.value !== null || selectedWarehouseId.value || selectedBrandId.value || selectedCategoryId.value || selectedSupplierId.value)) {
    // alert('Không tìm thấy sản phẩm nào.');
  }
};

const searchProduct = () => {
  currentPage.value = 1;
  applyFiltersAndSearch();
};

const removeProduct = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    try {
      await deleteProductApi(id);
      products.value = products.value.filter(c => c.id !== id);
      originalProducts.value = originalProducts.value.filter(c => c.id !== id);
      alert('Xóa sản phẩm thành công!');
      applyFiltersAndSearch();
    } catch (error) {
      console.error('Error removing product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm.');
    }
  }
};

const showFullImage = (imageUrl) => {
  fullImageUrl.value = instance.defaults.baseURL + imageUrl;
  showImageModal.value = true;
};

const closeFullImage = () => {
  showImageModal.value = false;
  fullImageUrl.value = '';
};

const filteredProducts = computed(() => products.value);

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5; // Số trang tối đa hiển thị
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage.value - half);
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1);

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page) => {
  currentPage.value = page;
};

const goToFirstPage = () => {
  currentPage.value = 1;
};

const goToLastPage = () => {
  currentPage.value = totalPages.value;
};

const changeItemsPerPage = () => {
  currentPage.value = 1; // Reset về trang 1 khi thay đổi số lượng hiển thị
  applyFiltersAndSearch();
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(products.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  XLSX.writeFile(workbook, 'products.xlsx');
};
</script>

<style scoped>
i {
  margin-right: 8px;
}
.actions-col i,
.close-btn i {
  margin-right: 0;
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
  margin-bottom: 2rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 2rem;
  color: #1a1a1a;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.add-btn {
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #218838;
}

.control-panel {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.filter-item label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.filter-item select,
.search-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;
}

.filter-item select:focus,
.search-input:focus {
  border-color: #007bff;
  outline: none;
}

.search-wrapper {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #007bff;
}

.search-input {
  padding-left: 2.5rem;
  /* width: 100%; */
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-btn,
.reset-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.filter-btn {
  background: #e9ecef;
  color: #495057;
}

.filter-btn.active {
  background: #007bff;
  color: white;
}

.filter-btn:hover:not(.active) {
  background: #dee2e6;
}

.reset-btn {
  background: #dc3545;
  color: white;
}

.reset-btn:hover {
  background: #c82333;
}

.pagination-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-options label {
  font-size: 0.9rem;
  color: #555;
}

.pagination-options select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.table-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.product-table th,
.product-table td {
  padding: 1.2rem;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
  border-right: 1px solid #e9ecef;
}

.product-table th:last-child,
.product-table td:last-child {
  border-right: none;
}

.product-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #343a40;
  font-size: 0.95rem;
  text-transform: uppercase;
  position: sticky;
  top: 0;
  z-index: 1;
}

.product-table td {
  color: #495057;
  font-size: 0.9rem;
}

.product-table tr:hover {
  background: #f1f3f5;
}

.stt { width: 5%; }
.image { width: 10%; }
.product-name { width: 30%; text-align: left; }
.price { width: 15%; }
.stock { width: 10%; }
.brand { width: 15%; }
.actions-col { 
  /* width: 15%;  */
  height: 100%;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.1);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 12px 0px;
}

.action-btn.view { background: #17a2b8; color: white; }
.action-btn.edit { background: #ffc107; color: white; }
.action-btn.delete { background: #dc3545; color: white; }

.action-btn:hover {
  opacity: 0.9;
  transform: scale(1.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.page-btn {
  padding: 0.5rem;
  background: #e9ecef;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  background: #ced4da;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background: #dee2e6;
}

.loading,
.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.full-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -40px;
  padding: 0.75rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #c82333;
}
</style>