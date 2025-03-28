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
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span>{{ formatDate(warehouse.createdAt) }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
                  class="details-btn"
                  title="Xem chi tiết"
                >
                  <router-link :to="`/details-warehouse/${warehouse.id}`"  style="color: white;">
                    <i class="fa-solid fa-eye"></i>
                  </router-link>
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
            <div class="table-cell">
              <div class="action-buttons">
                <button 
                  class="details-btn"
                  title="Xem chi tiết"
                >
                  <router-link :to="`/details-warehouse/${warehouse.id}`" style="color: white;">
                    <i class="fa-solid fa-eye"></i>
                  </router-link>
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
import Navbar from "@/components/NavbarComponent.vue";
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
const warehouseToEdit = ref(null);
const isEditVisible = ref(false);

onMounted(() => {
  fetchListWarehouse();
});

const fetchListWarehouse = async () => {
  try {
    const response = await getListWarehouseApi();
    if (response && response.data && response.data.data) {
      listWarehouse.value = response.data.data;
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
      await fetchListWarehouse();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
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
  background: #f4f6f9;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  width: calc(100% - 280px);
  padding: 2rem;
}

/* Header */
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

/* Controls */
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
  align-items: center;
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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
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
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

.add-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.tool-bar {
  display: flex;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.75rem;
  background: #e9ecef;
  color: #343a40;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.view-btn.active,
.view-btn:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

/* Grid View */
.warehouse-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.warehouse-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.warehouse-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  margin-bottom: 1rem;
}

.warehouse-name {
  font-size: 1.5rem;
  color: #343a40;
  font-weight: 600;
  margin: 0;
}

.warehouse-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #6c757d;
  margin: 0.5rem 0;
}

.info-item i {
  color: #007bff;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.details-btn,
.edit-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.details-btn {
  background: #17a2b8;
  color: white;
}

.details-btn:hover {
  background: #138496;
  transform: scale(1.05);
}

.edit-btn {
  background: #ffc107;
  color: #343a40;
}

.edit-btn:hover {
  background: #e0a800;
  transform: scale(1.05);
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
  transform: scale(1.05);
}

/* List View */
.warehouse-table-wrapper {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.table-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr 1fr;
  gap: 1px;
  background: #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: contents;
}

.table-header .table-cell {
  background: #f8f9fa;
  font-size: 1rem;
  font-weight: 600;
  color: #343a40;
  padding: 1rem;
  text-align: left;
}

.table-row {
  display: contents;
}

.table-row .table-cell {
  background: #fff;
  padding: 1rem;
  font-size: 1rem;
  color: #343a40;
  border-bottom: 1px solid #ddd;
}

.table-row:hover .table-cell {
  background: #f1f3f5;
  transition: background 0.2s ease;
}

.table-row .action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>