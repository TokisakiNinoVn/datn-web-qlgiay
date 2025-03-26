<template>
  <div class="container">
    <Navbar />
    <div class="main-content" v-if="user">
      <div class="header">
        <h2 class="title">Thông tin nhân viên</h2>
      </div>

      <div class="profile-container">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <!-- <img
              :src="user.avatar_url || 'https://i.pinimg.com/736x/f9/87/88/f98788254165eaf578684b158e30ff96.jpg'"
              alt="Avatar nhân viên"
              class="avatar"
            /> -->
            <img v-if="dataUser.id === 1" src="https://i.pinimg.com/736x/a1/b6/b5/a1b6b5158e684d357b5ae1bb55da232b.jpg" alt="Avatar nhân viên" class="avatar" />
            <img v-else-if="user.avatar_url === null || user.avatar_url === 0" src="https://i.pinimg.com/736x/a1/b6/b5/a1b6b5158e684d357b5ae1bb55da232b.jpg" alt="Avatar nhân viên" class="avatar" />
            <img v-else :src="instance.defaults.baseURL + user.avatar_url" alt="Avatar nhân viên" class="avatar" />
            <div class="avatar-actions">
              <label class="upload-label">
                <input type="file" @change="onFileChange" accept="image/*" hidden />
                <i class="fas fa-camera"></i> Chọn ảnh
              </label>
              <button @click="uploadAvatar" class="upload-btn" :disabled="!newAvatar">
                <i class="fas fa-upload"></i> Cập nhật hình đại diện
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Info Section -->
        <div class="profile-section">
          <div class="profile-card">
            <div class="profile-header">
              <input v-model="user.full_name" class="info-input name-input" placeholder="Họ và tên" />
              <div class="info-role">
                <span :class="user.role === 'Quản trị viên' ? 'role-admin' : 'role-staff'">{{ user.role }}</span>
              </div>
            </div>

            <div class="info-details">
              <div class="info-item">
                <i class="fas fa-envelope icon"></i>
                <span class="label">Email:</span>
                <input v-model="user.email" class="info-input" placeholder="Email" />
              </div>
              <div class="info-item">
                <i class="fas fa-venus-mars icon"></i>
                <span class="label">Giới tính:</span>
                <select v-model="user.gender" class="info-input">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div class="info-item">
                <i class="fas fa-phone icon"></i>
                <span class="label">Số điện thoại:</span>
                <input v-model="user.phone" class="info-input" placeholder="Số điện thoại" />
              </div>
              <div class="info-item">
                <i class="fas fa-map-marker-alt icon"></i>
                <span class="label">Địa chỉ:</span>
                <input style="width: auto;" v-model="user.address" class="info-input" placeholder="Địa chỉ" />
              </div>
              <!-- <div class="info-item">
                <i class="fas fa-clock icon"></i>
                <span class="label">Cập nhật lần cuối:</span>
                <span class="value">{{ formattedDate }}</span>
              </div> -->
              <div class="info-item full-width">
                <i class="fas fa-sticky-note icon"></i>
                <span class="label">Ghi chú:</span>
                <textarea v-model="user.note" class="info-input textarea" placeholder="Ghi chú"></textarea>
              </div>
            </div>

            <div class="actions">
              <router-link to="/home" class="action-btn back">
                <i class="fas fa-arrow-left"></i> Quay lại
              </router-link>
              <button @click="updateUser" class="action-btn update">
                <i class="fas fa-save"></i> Lưu thay đổi
              </button>
              <button @click="handleLogout" class="action-btn logout">
                <i class="fas fa-sign-out-alt"></i> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <i class="fas fa-user-slash"></i>
      Không có thông tin nhân viên nào được tìm thấy.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/NavbarComponent.vue';
import { getUserByIdApi, updateMyInforApi } from '@/services/modules/user.api';
import { uploadNormalApi } from '@/services/modules/upload.api';
import instance from '@/services/axiosConfig';

const router = useRouter();
const user = ref(null);
const formattedDate = ref('');
const newAvatar = ref(null);
const dataUser = JSON.parse(localStorage.getItem('user'));

onMounted(async () => {
  try {
    const userId = dataUser.id;
    const response = await getUserByIdApi(userId);
    user.value = response.data;
    formattedDate.value = new Date(response.updateAt).toLocaleString('vi-VN');
  } catch (error) {
    console.error('Lỗi tải dữ liệu người dùng:', error);
  }
});

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('user');
  localStorage.setItem('isLoggedIn', 'false');
  router.push('/login');
};

const onFileChange = (event) => {
  newAvatar.value = event.target.files[0];
};

const uploadAvatar = async () => {
  if (!newAvatar.value) {
    alert('Vui lòng chọn ảnh trước!');
    return;
  }

  const formData = new FormData();
  formData.append('file', newAvatar.value);

  try {
    const response = await uploadNormalApi(formData);
    console.log('Kết quả tải ảnh lên:', response);
    const avatarId = response.data.data[0].id;
    console.log('Đường dẫn ảnh:', avatarId);
    const updatedUser = {
      id: dataUser.id,
      avatar_id: avatarId
    };
    await updateMyInforApi( updatedUser);
    user.value.avatar_url = avatarId;
    alert('Cập nhật ảnh đại diện thành công!');

  } catch (error) {
    console.error('Lỗi tải ảnh lên:', error);
    alert('Cập nhật ảnh thất bại!');
  }
};

const updateUser = async () => {
  try {
    const dataUpdate = {
      ...user.value,
      id: dataUser.id
    };
    await updateMyInforApi(dataUpdate);
    formattedDate.value = new Date().toLocaleString('vi-VN');
    alert('Cập nhật thông tin thành công!');
  } catch (error) {
    console.error('Lỗi cập nhật:', error);
    alert('Cập nhật thông tin thất bại!');
  }
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
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title {
  font-size: 1.75rem;
  color: #fff;
  font-weight: 700;
  margin: 0;
  text-align: center;
}

.profile-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.avatar-section {
  flex: 1;
  min-width: 300px;
}

.profile-section {
  flex: 2;
  min-width: 400px;
}

.profile-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.avatar-wrapper {
  text-align: center;
}

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #007bff;
  margin-bottom: 1rem;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upload-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-label:hover {
  background: #218838;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.upload-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.upload-btn:hover:not(:disabled) {
  background: #0056b3;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

.name-input {
  font-size: 1.5rem;
  font-weight: 600;
  color: #343a40;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 8px;
  width: 80%;
  margin-bottom: 0.5rem;
}

.info-role span {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
}

.role-admin {
  background: #007bff;
  color: white;
}

.role-staff {
  background: #6c757d;
  color: white;
}

.info-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.full-width {
  grid-column: 1 / -1;
}

.icon {
  font-size: 1.25rem;
  color: #007bff;
}

.label {
  font-size: 1rem;
  color: #555;
  font-weight: 500;
  min-width: 100px;
}

.info-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.info-input:focus {
  border-color: #007bff;
  outline: none;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.value {
  font-size: 1rem;
  color: #343a40;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.back {
  background: #6c757d;
  color: white;
}

.back:hover {
  background: #5a6268;
}

.update {
  background: #007bff;
  color: white;
}

.update:hover {
  background: #0056b3;
}

.logout {
  background: #dc3545;
  color: white;
}

.logout:hover {
  background: #c82333;
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 80px);
  font-size: 1.25rem;
  color: #6c757d;
  gap: 0.5rem;
}
</style>