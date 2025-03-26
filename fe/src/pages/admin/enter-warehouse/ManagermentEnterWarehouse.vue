<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Quản lý đơn nhập kho</h1>
        <div class="stats">
          <span>Tổng: {{ filteredEnterWarehouses.length }} đơn nhập kho</span>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="filters">
          <div class="filter-item">
            <label>Mã hóa đơn</label>
            <div class="search-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchInvoiceCode"
                type="text"
                placeholder="Tìm kiếm theo mã hóa đơn..."
                class="search-input"
                @keyup.enter="applyFilters"
                maxlength="6"
                @input="limitInput"
                
              />
            </div>
          </div>
          <div class="filter-item">
            <label>Người tạo</label>
            <div class="search-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchCreatedBy"
                type="text"
                placeholder="Tìm kiếm theo người tạo..."
                class="search-input"
                @keyup.enter="applyFilters"
              />
            </div>
          </div>
          <div class="filter-item">
            <label>Từ ngày</label>
            <input
              v-model="startDate"
              type="date"
              class="date-input"
              @change="applyFilters"
            />
          </div>
          <div class="filter-item">
            <label>Đến ngày</label>
            <input
              v-model="endDate"
              type="date"
              class="date-input"
              @change="applyFilters"
            />
          </div>
          <div v-if="roleUser.code === 'admin'" class="filter-item">
            <label>Kho hàng</label>
            <select v-model="selectedWarehouseId" @change="applyFilters">
              <option :value="null">Tất cả</option>
              <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Nhà cung cấp</label>
            <select v-model="selectedSupplierId" @change="applyFilters">
              <option :value="null">Tất cả</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
            </select>
          </div>
          <div class="filter-actions">
            <button @click="resetFilters" class="reset-btn">
              <i class="fas fa-undo mr-2" style="margin-right: 8px;"></i> Reset Filter
            </button>
            <button @click="showAddForm" class="add-btn">
              <router-link :to="`/enterwarehouse-create`">
                <i class="fas fa-plus mr-2" style="margin-right: 8px; color: white;"></i> Thêm đơn nhập kho
              </router-link>
            </button>

            <div>
              <button @click="exportToExcel" style="">Xuất Excel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enter Warehouse Table -->
      <div class="enterwarehouse-table-wrapper">
        <table class="enterwarehouse-table" v-if="filteredEnterWarehouses.length > 0">
          <thead>
            <tr>
              <th class="stt">STT</th>
              <th class="invoice-code">Mã đơn</th>
              <th class="total-product">Số lượng sản phẩm</th>
              <th class="total-price">Tổng tiền (VNĐ)</th>
              <th class="status">Trạng thái</th>
              <th class="created-by">Người thực hiện</th>
              <th class="actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(enterWarehouse, index) in filteredEnterWarehouses" :key="enterWarehouse.id">
              <td class="stt">{{ index + 1 }}</td>
              <td class="invoice-code">{{ enterWarehouse.invoice_code }}</td>
              <td class="total-product">{{ enterWarehouse.total_product }}</td>
              <td class="total-price">{{ formatCurrency(enterWarehouse.total_price) }}</td>
              <td class="status">{{ enterWarehouse.transaction_status }}</td>
              <td class="created-by">{{ enterWarehouse.created_by }}</td>
              <td class="actions">
                <button class="action-btn view-btn" title="Xem chi tiết">
                  <router-link :to="`/details-enterwarehouse/${enterWarehouse.id}`">
                    <i class="fas fa-eye"></i>
                  </router-link>
                </button>
                <button @click.stop="removeEnterWarehouse(enterWarehouse.id)" class="action-btn delete-btn" title="Xóa">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else-if="isMiniLoading" class="loading">
          <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải...
        </div>
        <div v-else class="no-results">
          <i class="fas fa-box-open mr-2"></i> Không tìm thấy đơn nhập kho nào.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import { getAllEnterWarehouseApi, deleteEnterWarehouseApi } from '@/services/modules/enter-warehouse.api';
import { getForAddApi } from '@/services/modules/product.api';
import * as XLSX from "xlsx";

const roleUser = JSON.parse(localStorage.getItem('roles'));

const enterWarehouses = ref([]);
const isMiniLoading = ref(false);
const searchInvoiceCode = ref('');
const searchCreatedBy = ref('');
const startDate = ref('');
const endDate = ref('');
const showAddModal = ref(false);
const idAdminLogin = ref(null);
const selectedWarehouseId = ref(null);
const selectedSupplierId = ref(null);
const suppliers = ref([]);
const warehouses = ref([]);

// endDate là ngày hiện tại
const today = new Date();
endDate.value = today.toISOString().split('T')[0];

onBeforeMount(() => {
  fetchAllEnterWarehouse();
  fetchFilter();
  const userInfor = localStorage.getItem('user');
  if (userInfor) {
    const user = JSON.parse(userInfor);
    idAdminLogin.value = user.id;
  }
});

const fetchAllEnterWarehouse = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllEnterWarehouseApi();
    enterWarehouses.value = response.data.data;
    // console.log('enterWarehouses', enterWarehouses.value.length); // Kiểu tra thấy 6 đơn nhập kho
  } catch (error) {
    console.error('Error fetching enter warehouses:', error);
    enterWarehouses.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

const fetchFilter = async () => {
  try {
    const response = await getForAddApi();
    const data = response.data.data;
    suppliers.value = data.suppliers;
    warehouses.value = data.warehouses;
  } catch (error) {
    console.error('Error fetching filter data:', error);
  }
};

const showAddForm = () => {
  showAddModal.value = true;
};

const removeEnterWarehouse = async (id) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa đơn nhập kho này?');
  if (confirmDelete) {
    try {
      await deleteEnterWarehouseApi(id);
      enterWarehouses.value = enterWarehouses.value.filter(ew => ew.id !== id);
      alert('Đơn nhập kho đã được xóa!');
    } catch (error) {
      console.error('Error removing enter warehouse:', error);
      alert('Có lỗi xảy ra khi xóa đơn nhập kho.');
    }
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(parseFloat(value));
};

const limitInput = () => {
  searchInvoiceCode.value = searchInvoiceCode.value
    .replace(/[^0-9]/g, '')
    .slice(0, 6);
};

const filteredEnterWarehouses = computed(() => {
  let filtered = [...enterWarehouses.value];

  // console.log('Trước khi lọc:', filtered.length);

  // Lọc theo mã hóa đơn
  const query = searchInvoiceCode.value.toString();
  if (/^\d{6}$/.test(query)) {
    filtered = filtered.filter(ew => {
      const invoiceCode = String(ew.invoice_code);
      return invoiceCode.includes(query);
    });
  } 
  // console.log('Sau khi lọc theo mã hóa đơn:', filtered.length);

  // Lọc theo người tạo
  if (searchCreatedBy.value) {
    const query = searchCreatedBy.value.toLowerCase();
    filtered = filtered.filter(
      ew => ew.created_by && ew.created_by.toLowerCase().includes(query)
    );
  }

  if (startDate.value || endDate.value) {
    filtered = filtered.filter(ew => {
      const createdAt = new Date(ew.createdAt);
      const start = startDate.value ? new Date(startDate.value) : null;
      const end = endDate.value ? new Date(endDate.value + 'T23:59:59') : null; // Thêm giờ để bao gồm cả ngày

      const isAfterStart = start ? createdAt >= start : true;
      const isBeforeEnd = end ? createdAt <= end : true;

      return isAfterStart && isBeforeEnd;
    });
  }

  // Lọc theo kho hàng
  if (selectedWarehouseId.value) {
    filtered = filtered.filter(
      ew => ew.warehouse_id === selectedWarehouseId.value
    );
  }

  // Lọc theo nhà cung cấp
  if (selectedSupplierId.value) {
    filtered = filtered.filter(
      ew => ew.supplier_id === selectedSupplierId.value
    );
  }

  return filtered;
});

const applyFilters = () => {
  // Không cần thêm logic vì filteredEnterWarehouses đã xử lý trong computed
};

const resetFilters = () => {
  searchInvoiceCode.value = '';
  searchCreatedBy.value = '';
  startDate.value = '';
  endDate.value = today.toISOString().split('T')[0];
  selectedWarehouseId.value = null;
  selectedSupplierId.value = null;
  applyFilters();
};

const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(filteredEnterWarehouses.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Enter Warehouses');
  XLSX.writeFile(wb, 'enter-warehouses.xlsx');
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
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.controls {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
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

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #007bff;
}

.search-input,
.date-input,
.filter-item select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input {
  padding-left: 2.5rem;
  width: 80%;
}

.date-input {
  width: 180px;
}

.filter-item select {
  width: 100%;
}

.search-input:focus,
.date-input:focus,
.filter-item select:focus {
  border-color: #007bff;
  outline: none;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.add-btn,
.reset-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.add-btn {
  background: #28a745;
  color: white;
}

a {
  color: white;
  text-decoration: none;
}

.add-btn:hover {
  background: #218838;
}

.reset-btn {
  background: #dc3545;
  color: white;
}

.reset-btn:hover {
  background: #c82333;
}

.enterwarehouse-table-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.enterwarehouse-table {
  width: 100%;
  border-collapse: collapse;
}

.enterwarehouse-table th,
.enterwarehouse-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.enterwarehouse-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #343a40;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.enterwarehouse-table td {
  color: #495057;
  font-size: 0.9rem;
}

.enterwarehouse-table tr:hover {
  background: #f1f3f5;
}

.stt { width: 5%; }
.invoice-code { width: 15%; }
.total-product { width: 15%; }
.total-price { width: 20%; }
.status { width: 15%; }
.created-by { width: 20%; }
/* .actions { width: 15%; } */

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
  color: white;
}

.action-btn a {
  color: white;
  text-decoration: none;
}

.view-btn {
  background: #17a2b8;
}

.delete-btn {
  background: #dc3545;
}

.action-btn:hover {
  opacity: 0.9;
  transform: scale(1.1);
}

.status-pending {
  color: #ffc107;
  font-weight: 500;
}

.status-completed {
  color: #28a745;
  font-weight: 500;
}

.status-cancelled {
  color: #dc3545;
  font-weight: 500;
}

.loading,
.no-results {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
}
</style>