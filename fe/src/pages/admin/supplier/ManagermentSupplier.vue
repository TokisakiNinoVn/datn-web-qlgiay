<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h1 class="title">Quản lý Nhà cung cấp</h1>
        <div class="stats">
          <span>Tổng: {{ filteredSuppliers.length }} nhà cung cấp</span>
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
              placeholder="Tìm kiếm theo tên nhà cung cấp..."
              class="search-input"
            />
          </div>
          <button @click="showAddForm" class="add-btn">
            <i class="fas fa-plus mr-2"></i> Thêm nhà cung cấp
          </button>
        </div>
      </div>

      <!-- Supplier Table -->
      <div class="supplier-table-wrapper">
        <div class="table-grid">
          <div class="table-header">
            <div class="table-cell">STT</div>
            <div class="table-cell">Tên nhà cung cấp</div>
            <div class="table-cell">Địa chỉ</div>
            <!-- <div class="table-cell">Email</div> -->
            <div class="table-cell">Số điện thoại</div>
            <div class="table-cell">Hành động</div>
          </div>
          <div
            v-for="(supplier, index) in filteredSuppliers"
            :key="supplier.id"
            class="table-row"
          >
            <div class="table-cell">{{ index + 1 }}</div>
            <div class="table-cell">{{ supplier.name }}</div>
            <div class="table-cell">{{ supplier.address }}</div>
            <!-- <div class="table-cell">{{ supplier.email }}</div> -->
            <div class="table-cell">{{ supplier.phone }}</div>
            <div class="table-cell action-cell">
              <button @click.stop="viewSupplier(supplier)" class="action-btn view-btn">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click.stop="showUpdateForm(supplier)" class="action-btn edit-btn">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button @click.stop="removeSupplier(supplier.id)" class="action-btn delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-if="isMiniLoading" class="loading">Đang tải...</div>
        <div v-if="!isMiniLoading && filteredSuppliers.length === 0" class="no-results">
          Không tìm thấy nhà cung cấp nào.
        </div>
      </div>

      <!-- Modals -->
      <SupplierDetail :supplier="supplierDetail" :visible="showDetail" @close="closeDetail" />
      <SupplierAdd :show="showAddModal" @close="closeAddModal" @addSupplier="addSupplier" />
      <SupplierUpdate
        :show="showUpdateModal"
        :supplier="selectedSupplier"
        @close="closeUpdateModal"
        @updateSupplier="updateSupplier"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import SupplierDetail from './DetailSupplier.vue';
import SupplierAdd from './AddSupplier.vue';
import SupplierUpdate from './UpdateSupplier.vue';
import {
  getAllSupplierApi,
  addSupplierApi,
  updateSupplierApi,
  deleteSupplierApi
} from '@/services/modules/supplier.api';

const suppliers = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const showDetail = ref(false);
const supplierDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedSupplier = ref(null);
const idAdminLogin = ref(null);

onBeforeMount(() => {
  fetchSuppliers();
  const userInfor = localStorage.getItem('user');
  if (userInfor) {
    const user = JSON.parse(userInfor);
    idAdminLogin.value = user.id;
  }
});

const fetchSuppliers = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllSupplierApi();
    if (Array.isArray(response.data.data)) {
      suppliers.value = response.data.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    suppliers.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

const filteredSuppliers = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return suppliers.value.filter(supplier =>
    supplier.name.toLowerCase().includes(query)
  );
});

const showAddForm = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

const addSupplier = async (supplierData) => {
  try {
    supplierData.idAdmin = idAdminLogin.value;
    await addSupplierApi(supplierData);
    alert('Thêm nhà cung cấp thành công!');
    fetchSuppliers();
    closeAddModal();
  } catch (error) {
    console.error('Error adding supplier:', error);
    alert('Có lỗi xảy ra khi thêm nhà cung cấp.');
  }
};

const showUpdateForm = (supplier) => {
  selectedSupplier.value = { ...supplier };
  showUpdateModal.value = true;
};

const updateSupplier = async (updatedSupplier) => {
  try {
    updatedSupplier.idAdmin = idAdminLogin.value;
    await updateSupplierApi(updatedSupplier);
    alert('Cập nhật nhà cung cấp thành công!');
    fetchSuppliers();
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating supplier:', error);
    alert('Có lỗi xảy ra khi cập nhật nhà cung cấp.');
  }
};

const removeSupplier = async (id) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?');
  if (confirmDelete) {
    try {
      await deleteSupplierApi(id);
      alert('Nhà cung cấp đã được xóa!');
      fetchSuppliers();
    } catch (error) {
      console.error('Error removing supplier:', error);
      alert('Có lỗi xảy ra khi xóa nhà cung cấp.');
    }
  }
};

const viewSupplier = (supplier) => {
  supplierDetail.value = supplier;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  supplierDetail.value = null;
};
</script>

<style scoped>
/* General Styles */
.container {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 15px;
  border-bottom: 1px solid #e8ecef;
  margin-bottom: 25px;
}

.title {
  color: #2c3e50;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.stats {
  color: #7f8c8d;
  font-size: 16px;
}

/* Controls */
.controls {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-add {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #95a5a6;
}

.search-input {
  width: 90%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
  outline: none;
}

.add-btn {
  background: #27ae60;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #219653;
}

/* Table Styles */
.supplier-table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
}

.table-grid {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 220px;
  gap: 1px;
  background: #e8ecef;
}

.table-header {
  display: contents;
}

.table-row {
  display: contents;
}

.table-cell {
  background: white;
  padding: 15px;
  color: #636e72;
  font-size: 14px;
  border-bottom: 1px solid #e8ecef;
}

.table-header .table-cell {
  background: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 15px;
  border-bottom: 2px solid #e8ecef;
}

.table-row:hover .table-cell {
  background: #f8f9fa;
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.action-cell {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  flex: 1;
}

.action-btn.view-btn {
  background: #3498db;
  color: white;
}

.action-btn.view-btn:hover {
  background: #2980b9;
}

.action-btn.edit-btn {
  background: #f39c12;
  color: white;
}

.action-btn.edit-btn:hover {
  background: #e08e0b;
}

.action-btn.delete-btn {
  background: #e74c3c;
  color: white;
}

.action-btn.delete-btn:hover {
  background: #c0392b;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

.no-results {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}
</style>