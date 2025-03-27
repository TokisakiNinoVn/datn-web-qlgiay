<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h1 class="title">Quản lý Kho hàng</h1>
        <div class="stats">
          <span>Tổng: {{ filteredWarehouses.length }} kho hàng</span>
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
              placeholder="Tìm kiếm theo ID, tên kho, hoặc tên quản lý..."
              class="search-input"
            />
          </div>
          <router-link to="/warehouse-management/add" class="add-btn">
            <i class="fas fa-plus mr-2"></i> Thêm kho hàng
          </router-link>
          <div class="tool-bar">
            <div class="view-toggle">
              <button 
                @click="viewMode = 'grid'" 
                :class="{ 'active': viewMode === 'grid' }"
                class="view-btn"
                style="margin-right: 10px;"
              >
                <i class="fas fa-th"></i>
              </button>
              <button 
                @click="viewMode = 'list'" 
                :class="{ 'active': viewMode === 'list' }"
                class="view-btn"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="warehouse-grid">
        <div 
          v-for="warehouse in filteredWarehouses" 
          :key="warehouse.id" 
          class="warehouse-card"
        >
          <div class="card-header">
            <h3 class="warehouse-name">{{ warehouse.name }}</h3>
          </div>
          <div class="warehouse-info">
            <div class="info-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ warehouse.address }}</span>
            </div>
            <div v-if="warehouse.manager_info" class="info-item">
              <i class="fas fa-user"></i>
              <span>{{ warehouse.manager_info.full_name }}</span>
            </div>
            <div v-else class="info-item">
              <i class="fas fa-user"></i>
              <span>Chưa có</span>
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span>{{ formatDate(warehouse.createdAt) }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
              @click.stop="openDetailsGrid(warehouse)" 
              class="details-btn"
              title="Xem chi tiết"
            >
              <i class="fa-solid fa-eye"></i>
            </button>
            <button 
              @click.stop="editWarehouse(warehouse)" 
              class="edit-btn"
              title="Chỉnh sửa"
            >
              <i class="fa-solid fa-pencil"></i>
            </button>
            <button 
              @click.stop="deleteWarehouse(warehouse)" 
              class="delete-btn"
              title="Xóa"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-if="viewMode === 'list'" class="warehouse-table-wrapper">
        <div class="table-grid">
          <div class="table-header">
            <div class="table-cell">STT</div>
            <div class="table-cell">Tên</div>
            <div class="table-cell">Địa chỉ</div>
            <div class="table-cell">Quản lý</div>
            <div class="table-cell">Hành động</div>
          </div>
          <div 
            v-for="(warehouse, index) in filteredWarehouses" 
            :key="warehouse.id" 
            class="table-row"
          >
            <div class="table-cell">{{ index + 1 }}</div>
            <div class="table-cell">{{ warehouse.name }}</div>
            <div class="table-cell">{{ warehouse.address }}</div>
            <div class="table-cell">{{ warehouse.manager_info ? warehouse.manager_info.full_name : 'Chưa có' }}</div>
            <div class="table-cell">
              <div class="action-buttons">
                <button 
                  @click.stop="openDetailsTable(warehouse)" 
                  class="details-btn"
                  title="Xem chi tiết"
                >
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button 
                  @click.stop="editWarehouse(warehouse)" 
                  class="edit-btn"
                  title="Chỉnh sửa"
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button 
                  @click.stop="deleteWarehouse(warehouse)" 
                  class="delete-btn"
                  title="Xóa"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warehouse Details Modal -->
      <WarehouseDetails 
        :warehouse="selectedWarehouse" 
        :visible="isDetailsVisible" 
        @close="closeDetails" 
      />

      <!-- Edit Warehouse Modal -->
      <EditWarehouse 
        :warehouse="warehouseToEdit" 
        :visible="isEditVisible" 
        @close="closeEdit" 
        @update="updateWarehouse"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, createApp } from "vue";
// import { useRouter } from "vue-router";
import Navbar from "@/components/NavbarComponent.vue";
import WarehouseDetails from "./WarehouseDetail.vue";
import EditWarehouse from "./EditWarehouse.vue";
import {
  getListWarehouseApi,
  updateWarehouseApi,
  deleteWarehouseApi
} from "@/services/modules/warehouse.api";
import NotificationComponent from '@/components/NotificationComponent.vue';

const listWarehouse = ref([]);
const searchQuery = ref("");
const viewMode = ref("grid");
const selectedWarehouse = ref(null);
const warehouseToEdit = ref(null);
const isDetailsVisible = ref(false);
const isEditVisible = ref(false);

onMounted(() => {
  fetchListWarehouse();
});

const fetchListWarehouse = async () => {
  try {
    const response = await getListWarehouseApi();
    if (response && response.data && response.data.data) {
      listWarehouse.value = response.data.data;
      // console.log("Warehouse data loaded:", listWarehouse.value);
    } else {
      console.error("Invalid response structure:", response);
      listWarehouse.value = [];
    }
  } catch (error) {
    console.error("Error fetching warehouse list:", error);
    listWarehouse.value = [];
  }
};

const filteredWarehouses = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return listWarehouse.value.filter((warehouse) => 
    warehouse.id.toString().includes(query) ||
    warehouse.name.toLowerCase().includes(query) ||
    warehouse.address.toLowerCase().includes(query) || (warehouse.manager_info && warehouse.manager_info.full_name.toLowerCase().includes(query))
  );
});

const openDetailsGrid = (warehouse) => {
  selectedWarehouse.value = warehouse;
  isDetailsVisible.value = true;
};

const openDetailsTable = (warehouse) => {
  selectedWarehouse.value = warehouse;
  isDetailsVisible.value = true;
};

const closeDetails = () => {
  selectedWarehouse.value = null;
  isDetailsVisible.value = false;
};

const editWarehouse = (warehouse) => {
  warehouseToEdit.value = { ...warehouse };
  isEditVisible.value = true;
};

const closeEdit = () => {
  warehouseToEdit.value = null;
  isEditVisible.value = false;
};

const updateWarehouse = async (updatedWarehouse) => {
  try {
    await updateWarehouseApi(updatedWarehouse.id, updatedWarehouse);
    // showNotification("Cập nhật kho hàng thành công!", "success");
    // alert("Cập nhật kho hàng thành công!");
    await fetchListWarehouse(); // Refresh danh sách
    closeEdit();
  } catch (error) {
    console.error("Error updating warehouse:", error);
    // alert("Có lỗi xảy ra khi cập nhật kho!");
    showNotification("Có lỗi xảy ra khi cập nhật kho!", "error");
  }
};

const deleteWarehouse = async (warehouse) => {
  if (confirm(`Bạn có chắc muốn xóa kho "${warehouse.name}" không? \nCác dữ liệu liên quan cũng sẽ bị xóa đồng thời!`)) {
    try {
      await deleteWarehouseApi(warehouse.id);
      showNotification("Xóa kho hàng thành công!", "success");
      // alert("Xóa kho hàng thành công!");
      await fetchListWarehouse(); // Refresh danh sách
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      // alert("Có lỗi xảy ra khi xóa kho!");
      showNotification("Có lỗi xảy ra khi xóa kho!", "error");
    }
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
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
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #219653;
}

.tool-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.view-toggle .view-btn {
  padding: 10px 14px;
  border: 1px solid #dfe6e9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.view-toggle .view-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.view-toggle .view-btn:hover:not(.active) {
  background: #f5f6fa;
}

/* Grid View */
.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 20px;
}

.warehouse-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e8ecef;
  position: relative;
  overflow: hidden;
}

.warehouse-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
  background: #3498db;
  transition: width 0.3s;
}

.warehouse-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.warehouse-card:hover::before {
  width: 100%;
  opacity: 0.1;
}

.card-header {
  margin-bottom: 15px;
}

.warehouse-name {
  margin: 0;
  color: #2c3e50;
  font-size: 22px;
  font-weight: 600;
}

.warehouse-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
  color: #636e72;
  font-size: 15px;
}

.info-item i {
  color: #3498db;
  font-size: 16px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.details-btn, .edit-btn, .delete-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
  position: relative;
  z-index: 1;
}

.details-btn {
  background: #3498db;
  color: white;
}

.details-btn:hover {
  background: #2980b9;
}

.edit-btn {
  background: #f39c12;
  color: white;
}

.edit-btn:hover {
  background: #e67e22;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background: #c0392b;
}

/* Table View */
.warehouse-table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin: 20px;
  overflow-x: auto;
}

.table-grid {
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 150px;
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

.table-action-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
  width: 100%;
  position: relative;
  z-index: 1;
}

.table-action-btn:hover {
  background: #2980b9;
}
</style>