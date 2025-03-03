<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <div class="header">
        <h2 class="title">Quản lý thiết bị - {{ room?.name }}</h2>
        <router-link to="/room-management" class="back-btn">
          <i class="fas fa-arrow-left"></i> Quay lại
        </router-link>
      </div>

      <!-- Add Device Form -->
      <div class="form-section">
        <button 
          @click="showForm = !showForm" 
          class="toggle-form-btn"
        >
          <i class="fas fa-plus"></i>
          {{ showForm ? "Ẩn form" : "Thêm thiết bị mới" }}
        </button>

        <div v-if="showForm" class="form-container">
          <h3 class="form-title">Thêm thiết bị mới</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Tên thiết bị</label>
              <input 
                v-model="newDevice.name" 
                type="text" 
                placeholder="Nhập tên thiết bị" 
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>Số lượng</label>
              <input 
                v-model.number="newDevice.quantity" 
                type="number" 
                min="1" 
                placeholder="Số lượng" 
                class="form-input"
              >
            </div>
            <div class="form-group upload-group">
              <label>Hình ảnh</label>
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload" 
                class="form-file"
              >
            </div>
            <button 
              @click="addDevice" 
              class="submit-btn"
              :disabled="uploading"
            >
              <i class="fas fa-save"></i>
              {{ uploading ? "Đang tải..." : "Thêm thiết bị" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Device List -->
      <div class="devices-section">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Đang tải danh sách thiết bị...
        </div>
        <div v-else-if="devices.length > 0" class="devices-grid">
          <div 
            v-for="device in devices" 
            :key="device.id" 
            class="device-card"
          >
            <img 
              v-if="device.images && device.images.length > 0" 
              :src="instance.defaults.baseURL + device.images[0].url" 
              alt="Thiết bị" 
              class="device-image"
              @click="showFullImage(device.images[0].url)"
            >
            <div class="device-info">
              <p class="device-name">{{ device.name }}</p>
              <p class="device-quantity">Số lượng: {{ device.quantity }}</p>
            </div>
            <button 
              @click="deleteDevice(device.id)" 
              class="delete-btn"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div v-else class="no-devices">
          <i class="fas fa-tools"></i>
          Không có thiết bị nào trong phòng này
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Modal -->
    <div v-if="selectedImage" class="image-modal-overlay" @click.self="closeFullImage">
      <div class="image-modal">
        <img :src="instance.defaults.baseURL + selectedImage" alt="Full Image" class="full-image" />
        <button @click="closeFullImage" class="image-close-btn">
          <i class="fas fa-times"></i> Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/NavbarComponent.vue";
import { getRoomByIdApi, addDeviceToRoomApi, removeDeviceFromRoomApi } from "@/services/modules/warehouse.api";
import { uploadApi } from "@/services/modules/upload.api";
import instance from "@/services/axiosConfig.js";

const route = useRoute();
const room = ref(null);
const devices = ref([]);
const loading = ref(true);
const showForm = ref(false);
const uploading = ref(false);
const newDevice = ref({
  name: "",
  quantity: 1,
  price: 0,
  imageFile: null
});
const selectedImage = ref(null); // State để lưu URL ảnh được chọn

onMounted(async () => {
  try {
    const response = await getRoomByIdApi(route.params.id);
    room.value = response.data;
    devices.value = response.data.devices || [];
  } catch (error) {
    console.error("Lỗi khi tải thiết bị:", error);
  } finally {
    loading.value = false;
  }
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) newDevice.value.imageFile = file;
};

const addDevice = async () => {
  if (!newDevice.value.name || newDevice.value.quantity < 1) {
    alert("Vui lòng điền đầy đủ và đúng thông tin!");
    return;
  }

  try {
    uploading.value = true;
    let idImage;
    if (newDevice.value.imageFile) {
      const formData = new FormData();
      formData.append("file", newDevice.value.imageFile);
      formData.append("roomId", route.params.id);
      const response = await uploadApi(formData);
      idImage = response.data.data[0].id;
    }

    const body = {
      imageId: idImage,
      roomId: route.params.id,
      name: newDevice.value.name,
      quantity: newDevice.value.quantity,
      price: newDevice.value.price,
    };
    
    const response = await addDeviceToRoomApi(body);
    devices.value.push({
      id: response.data.deviceId,
      name: newDevice.value.name,
      quantity: newDevice.value.quantity,
      images: idImage ? [{ url: newDevice.value.imageFile.name }] : []
    });

    newDevice.value = { name: "", quantity: 1, price: 0, imageFile: null };
    showForm.value = false;
  } catch (error) {
    console.error("Lỗi khi thêm thiết bị:", error);
    alert("Có lỗi xảy ra khi thêm thiết bị!");
  } finally {
    uploading.value = false;
  }
};

const deleteDevice = async (deviceId) => {
  if (confirm("Bạn có chắc muốn xóa thiết bị này?")) {
    try {
      await removeDeviceFromRoomApi(deviceId);
      devices.value = devices.value.filter(device => device.id !== deviceId);
      alert("Xóa thiết bị thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa thiết bị:", error);
      alert("Có lỗi xảy ra khi xóa thiết bị!");
    }
  }
};

// Hàm xử lý hiển thị ảnh toàn màn hình
const showFullImage = (imageUrl) => {
  selectedImage.value = imageUrl;
};

const closeFullImage = () => {
  selectedImage.value = null;
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
}

.main-content {
  flex: 1;
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-left: 300px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  color: #2c3e50;
  font-weight: 600;
}

.back-btn {
  padding: 0.5rem 1rem;
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #2980b9;
}

.form-section {
  margin-bottom: 2rem;
}

.toggle-form-btn {
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}

.toggle-form-btn:hover {
  background: #2980b9;
}

.form-container {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-file {
  padding: 0.5rem 0;
}

.upload-group {
  align-self: end;
}

.submit-btn {
  padding: 0.75rem;
  background: #2ecc71;
  color: white;
  border-radius: 6px;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #27ae60;
}

.submit-btn:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.devices-section {
  margin-top: 1rem;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.device-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.device-card:hover {
  transform: translateY(-3px);
}

.device-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.device-image:hover {
  opacity: 0.8;
}

.device-info {
  flex: 1;
}

.device-name {
  font-weight: 500;
  color: #2c3e50;
}

.device-quantity {
  color: #666;
  font-size: 0.9rem;
}

.delete-btn {
  padding: 0.5rem;
  background: #e74c3c;
  color: white;
  border-radius: 6px;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c0392b;
}

.loading, .no-devices {
  text-align: center;
  padding: 2rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Fullscreen Image Modal Styles */
.image-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.image-modal {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.full-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.image-close-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #e74c3c;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.image-close-btn:hover {
  background: #c0392b;
}
</style>