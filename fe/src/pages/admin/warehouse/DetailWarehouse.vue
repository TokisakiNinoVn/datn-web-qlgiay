<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Chi tiết {{ warehouse?.name || '' }}</h1>
        <router-link to="/warehouse-management" class="back-btn">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </router-link>
      </div>

      <!-- Thông tin chi tiết kho -->
      <div class="warehouse-info">
        <h2 class="infor-warehouse warehouse-name">{{ warehouse?.name || 'Chưa có thông tin' }}</h2>
        <p class="infor-warehouse warehouse-address">{{ warehouse?.address || 'Chưa có thông tin' }}</p>
        <p class="infor-warehouse warehouse-desciption">Các thông tin mô tả khác: {{ warehouse?.description || 'Chưa có thông tin' }}</p>
        <p class="infor-warehouse warehouse-created-at">Ngày tạo: {{ formatDate(warehouse?.createdAt) || 'Chưa có thông tin' }}</p>
        <p class="infor-warehouse warehouse-created-at">Cập nhật thông tin lần cuối:  {{ formatDate(warehouse?.updateAt) || 'Chưa có thông tin' }}</p>

      </div>

      <!-- Controls -->
      <div class="controls">
        <div class="search-add">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tên, điện thoại, địa chỉ, ID..."
              class="search-input"
              @keyup.enter="applyFilters"
            />
          </div>
        </div>
        <div class="filter-item">
          <button
            @click="filterByRole(2)"
            :class="{ 'active': selectedRole === 2 }"
            class="filter-btn"
          >
            <i class="fas fa-user-tie mr-2"></i> Quản lý kho
          </button>
          <button
            @click="filterByRole(3)"
            :class="{ 'active': selectedRole === 3 }"
            class="filter-btn"
          >
            <i class="fas fa-user mr-2"></i> Nhân viên kho
          </button>
          <button @click="resetFilters" class="reset-btn">
            <i class="fas fa-sync-alt mr-2"></i> Làm mới
          </button>
        </div>
      </div>

      <!-- Warehouse Details -->
      <div class="details-container" v-if="warehouse">
        <div class="details-layout">
          <table class="user-table">
            <thead>
              <tr class="table-header">
                <th class="table-cell">STT</th>
                <th class="table-cell">Họ và tên</th>
                <th class="table-cell">Chức vụ</th>
                <th class="table-cell">Số điện thoại</th>
                <th class="table-cell">Email</th>
                <th class="table-cell">Địa chỉ</th>
                <th class="table-cell">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(user, index) in filteredUsers"
                :key="user.id"
                class="table-row"
              >
                <td class="table-cell">{{ index + 1 }}</td>
                <td class="table-cell">{{ user.full_name || '' }}</td>
                <td class="table-cell">{{ getRoleName(user.role_id) }}</td>
                <td class="table-cell">{{ user.phone || '' }}</td>
                <td class="table-cell">{{ user.email || '' }}</td>
                <td class="table-cell">{{ user.address || '' }}</td>
                <td class="table-cell">
                  <button 
                    class="action-btn edit"
                    title="Cập nhật"
                  >
                    <router-link :to="`/update-user/${user.id}`">
                      <i class="fas fa-edit" style="margin-right: 0px;"></i>
                    </router-link>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="filteredUsers.length === 0" class="no-results">
            Không tìm thấy người dùng nào.
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!warehouse" class="loading">
        <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...
      </div>

      <!-- Full Image Modal -->
      <div v-if="showImageModal" class="image-modal">
        <div class="image-modal-content">
          <img :src="fullImageUrl" alt="Full Warehouse Image" class="full-image" />
          <button @click="closeFullImage" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/NavbarComponent.vue';
import { getWarehouseByIdApi } from '@/services/modules/warehouse.api';

const route = useRoute();
const router = useRouter();
const warehouseId = route.params.id;

const warehouse = ref(null);
const searchQuery = ref('');
const selectedRole = ref(null);

const showImageModal = ref(false);
const fullImageUrl = ref('');

onMounted(async () => {
  await fetchWarehouseDetails();
});

const fetchWarehouseDetails = async () => {
  try {
    const response = await getWarehouseByIdApi(warehouseId);
    warehouse.value = response.data.data;
    console.log('Warehouse details:', JSON.stringify(warehouse.value, null, 2));
  } catch (error) {
    console.error('Error fetching warehouse details:', error);
    alert('Không thể tải thông tin kho!');
    router.push('/warehouse-management');
  }
};

const filteredUsers = computed(() => {
  let users = warehouse.value?.listUser || [];
  const query = searchQuery.value.toLowerCase().trim();

  if (query) {
    users = users.filter(user =>
      user.full_name?.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query) ||
      user.address?.toLowerCase().includes(query) ||
      String(user.id).includes(query)
    );
  }

  if (selectedRole.value) {
    users = users.filter(user => user.role_id === selectedRole.value);
  }

  return users;
});

const getRoleName = (roleId) => {
  switch (roleId) {
    case 2:
      return 'Quản lý kho';
    case 3:
      return 'Nhân viên kho';
    default:
      return 'Không xác định';
  }
};

const filterByRole = (roleId) => {
  selectedRole.value = selectedRole.value === roleId ? null : roleId;
  applyFilters();
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedRole.value = null;
};

const applyFilters = () => {
  // Hàm này chỉ cần trigger lại computed property filteredUsers
};

const closeFullImage = () => {
  showImageModal.value = false;
  fullImageUrl.value = '';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false // Nếu bạn muốn hiển thị theo định dạng 24 giờ
  };
  return date.toLocaleString('vi-VN', options);
};

</script>
<style scoped>
/* Common styles */
i {
  margin-right: 8px;
}
.infor-warehouse {
  text-align: left;
}
/* Container */
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

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #fff;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #007bff;
  color: #fff;
}

/* Warehouse Info */
.warehouse-info {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.warehouse-name {
  font-size: 1.75rem;
  color: #343a40;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.warehouse-address,
.warehouse-desciption,
.warehouse-created-at,
.warehouse-last-update {
  font-size: 1rem;
  color: #6c757d;
  margin: 0.5rem 0;
}

.warehouse-address::before {
  content: "\f3c5"; /* Font Awesome location icon */
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 8px;
  color: #007bff;
}

.warehouse-desciption::before {
  content: "\f05a"; /* Font Awesome info icon */
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 8px;
  color: #007bff;
}

.warehouse-created-at::before,
.warehouse-last-update::before {
  content: "\f017"; /* Font Awesome clock icon */
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
  margin-right: 8px;
  color: #007bff;
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
  width: 100%;
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

.filter-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-btn,
.reset-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

.filter-btn {
  background: #e9ecef;
  color: #343a40;
}

.filter-btn:hover,
.filter-btn.active {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

/* Details Container */
.details-container {
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
  transition: background 0.2s ease;
}

.no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.25rem;
  color: #6c757d;
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
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.close-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}
</style>