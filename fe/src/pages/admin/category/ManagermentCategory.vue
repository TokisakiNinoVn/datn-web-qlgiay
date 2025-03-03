<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h1 class="title">Quản lý Danh mục</h1>
        <div class="stats">
          <span>Tổng: {{ filteredCategorys.length }} danh mục</span>
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
      </div>

      <!-- Category Table -->
      <div class="category-table-wrapper">
        <div class="table-grid">
          <div class="table-header">
            <div class="table-cell">STT</div>
            <div class="table-cell">Tên danh mục</div>
            <div class="table-cell">Số lượng sản phẩm</div>
            <div class="table-cell">Hành động</div>
          </div>
          <div
            v-for="(category, index) in filteredCategorys"
            :key="category.id"
            class="table-row"
          >
            <div class="table-cell">{{ index + 1 }}</div>
            <div class="table-cell">{{ category.name }}</div>
            <div class="table-cell">{{ category.total_products }}</div>
            <div class="table-cell action-cell">
              <button @click.stop="viewCategory(category)" class="action-btn view-btn">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button @click.stop="showUpdateForm(category)" class="action-btn edit-btn">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button @click.stop="removeCategory(category.id)" class="action-btn delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-if="isMiniLoading" class="loading">Đang tải...</div>
        <div v-if="!isMiniLoading && filteredCategorys.length === 0" class="no-results">
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
import { ref, onBeforeMount, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import CategoryDetail from './DetailCategory.vue';
import CategoryAdd from './AddCategory.vue';
import CategoryUpdate from './UpdateCategory.vue';
import {
  getAllCategoryApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
} from '@/services/modules/category.api';

const categorys = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const showDetail = ref(false);
const categoryDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedCategory = ref(null);
const idAdminLogin = ref(null);

onBeforeMount(() => {
  fetchCategorys();
  const userInfor = localStorage.getItem('user');
  if (userInfor) {
    const user = JSON.parse(userInfor);
    idAdminLogin.value = user.id;
  }
});

const fetchCategorys = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllCategoryApi();
    if (Array.isArray(response.data.data)) {
      categorys.value = response.data.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    categorys.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

const filteredCategorys = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return categorys.value.filter(category =>
    category.name.toLowerCase().includes(query)
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

const addCategory = async (categoryData) => {
  try {
    categoryData.idAdmin = idAdminLogin.value;
    await addCategoryApi(categoryData);
    alert('Thêm danh mục thành công!');
    fetchCategorys();
    closeAddModal();
  } catch (error) {
    console.error('Error adding category:', error);
    alert('Có lỗi xảy ra khi thêm danh mục.');
  }
};

const showUpdateForm = (category) => {
  selectedCategory.value = { ...category };
  showUpdateModal.value = true;
};

const updateCategory = async (updatedCategory) => {
  try {
    updatedCategory.idAdmin = idAdminLogin.value;
    await updateCategoryApi(updatedCategory);
    alert('Cập nhật danh mục thành công!');
    fetchCategorys();
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating category:', error);
    alert('Có lỗi xảy ra khi cập nhật danh mục.');
  }
};

const removeCategory = async (id) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa danh mục này?');
  if (confirmDelete) {
    try {
      await deleteCategoryApi(id);
      alert('Danh mục đã được xóa!');
      fetchCategorys();
    } catch (error) {
      console.error('Error removing category:', error);
      alert('Có lỗi xảy ra khi xóa danh mục.');
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
.category-table-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
}

.table-grid {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 220px; /* Điều chỉnh tỷ lệ cột */
  gap: 0; /* Loại bỏ khoảng cách giữa các ô */
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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