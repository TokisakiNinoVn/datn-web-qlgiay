<template>
  <div class="flex w-screen h-screen bg-gray-100">
    <Navbar />
    <div class="flex flex-col w-full p-6">
      <div class="flex flex-col mb-4">
        <h1 class="text-2xl font-bold mb-2">Quản lý nhân viên </h1>
        <div class="flex items-center mb-2">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập thông tin cần tìm kiếm..."
            class="border border-gray-300 rounded-lg p-2 mr-2 flex-grow focus:outline-none focus:ring focus:ring-yellow-500"
          />
          <button 
            class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition" 
            @click="searchStaff" 
            :disabled="isMiniLoading || !searchQuery">
            <ion-icon name="search-outline"></ion-icon>
          </button>
        </div>
        <div class="flex items-center mb-4">
          <button @click="resetFilters" class="flex items-center bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition ml-2">
            <ion-icon class="mr-1" name="refresh-outline"></ion-icon>
            Làm mới bảng
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <button @click="showAddForm" class="bg-green-500 text-white rounded-lg px-4 py-2 mb-4 hover:bg-green-600 transition">
          <ion-icon name="add-outline"></ion-icon> Thêm Nhân viên
        </button>
        <table v-if="staff.length > 0" class="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 p-2 text-left">ID</th>
              <th class="border border-gray-300 p-2 text-left">Tên đăng nhập</th>
              <th class="border border-gray-300 p-2 text-left">Tên</th>
              <th class="border border-gray-300 p-2 text-left">Email</th>
              <th class="border border-gray-300 p-2 text-left">Điện thoại</th>
              <th class="border border-gray-300 p-2 text-left">Trạng thái</th>
              <th class="border border-gray-300 p-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="staffMember in staff" :key="staffMember.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 p-2 text-center">{{ staffMember.id || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ staffMember.username || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ staffMember.name || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ staffMember.email || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ staffMember.phone || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">
                {{ 
                  staffMember.status === 'online' ? 'Đang hoạt động' : 
                  staffMember.status === 'offline' ? 'Không hoạt động' : 
                  staffMember.status === '0' ? 'Bị khóa' : 
                  '' 
                }}
              </td>
              <!-- <td class="border border-gray-300 p-2 text-center flex">
                <button 
                  @click="showUpdateForm(staffMember)" 
                  class="flex items-center justify-center text-yellow-500 hover:text-white bg-transparent hover:bg-yellow-400 transition-all rounded-full p-2 mx-1" 
                  title="Cập nhật">
                  <ion-icon class="text-2xl" name="pencil-outline"></ion-icon>
                </button>
                <button 
                  @click="viewStaff(staffMember)" 
                  class="flex items-center justify-center text-blue-500 hover:text-white bg-transparent hover:bg-blue-400 transition-all rounded-full p-2 mx-1" 
                  title="Xem chi tiết">
                  <ion-icon class="text-2xl" name="person-outline"></ion-icon>
                </button>
                <button 
                  @click="removeStaff(staffMember.id)" 
                  class="flex items-center justify-center text-red-500 hover:text-white bg-transparent hover:bg-red-400 transition-all rounded-full p-2 mx-1" 
                  title="Xóa">
                  <ion-icon class="text-2xl" name="trash-outline"></ion-icon>
                </button>
                <button 
                  @click="lockStaff(staffMember.id)"
                  class="flex items-center justify-center text-red-500 hover:text-white bg-transparent hover:bg-red-400 transition-all rounded-full p-2 mx-1" 
                  title="Khóa tài khoản">
                  <ion-icon class="text-2xl" name="medical-outline"></ion-icon>
                </button>
              </td> -->
              <td class="border border-gray-300 p-2 text-center flex">
                <button 
                  @click="showUpdateForm(staffMember)" 
                  class="flex items-center justify-center text-yellow-500 hover:text-white bg-transparent hover:bg-yellow-400 transition-all rounded-full p-2 mx-1" 
                  title="Cập nhật">
                  <ion-icon class="text-2xl" name="pencil-outline"></ion-icon>
                </button>
                <button 
                  @click="viewStaff(staffMember)" 
                  class="flex items-center justify-center text-blue-500 hover:text-white bg-transparent hover:bg-blue-400 transition-all rounded-full p-2 mx-1" 
                  title="Xem chi tiết">
                  <ion-icon class="text-2xl" name="person-outline"></ion-icon>
                </button>
                <button 
                  @click="removeStaff(staffMember.id)" 
                  class="flex items-center justify-center text-red-500 hover:text-white bg-transparent hover:bg-red-400 transition-all rounded-full p-2 mx-1" 
                  title="Xóa">
                  <ion-icon class="text-2xl" name="trash-outline"></ion-icon>
                </button>
                <button 
                  @click="lockStaff(staffMember)" 
                  class="flex items-center justify-center text-red-500 hover:text-white bg-transparent hover:bg-red-400 transition-all rounded-full p-2 mx-1" 
                  title="Khóa/mở khóa tài khoản">
                  <ion-icon class="text-2xl" :name="staffMember.status === '0' || staffMember.status === '1'  ? 'lock-open-outline' : 'lock-closed-outline'"></ion-icon> <!-- Thay đổi -->
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center mt-4">
          Không có dữ liệu!
        </div>
      </div>
    </div>
  </div>
  <div v-if="showDetail" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <StaffDetail :staff="staffDetail" @close="closeDetail" />
  </div>
  <StaffAdd :show="showAddModal" @close="closeAddModal" @addStaff="addStaff" />
  <StaffUpdate :show="showUpdateModal" :staff="selectedStaff" @close="closeUpdateModal" @updateStaff="updateStaff" />
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Navbar from '../../components/NavbarComponent.vue';
import StaffDetail from './DetailStaff.vue';
import StaffAdd from './AddStaff.vue';
import StaffUpdate from './UpdateStaff.vue';
import {
  add,
  update,
  remove,
  getById,
  getAllBasic,
  freezeApi,
  // getAll
} from '@/backup/staff.api';

const staff = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const selectedRole = ref('Nhân viên');
const showDetail = ref(false);
const staffDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
const selectedStaff = ref(null);
const idAdminLogin = ref(null);

const showAddForm = () => {
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

onBeforeMount(() => {
  fetchStaff();
  const userInfor = localStorage.getItem('user');
  const user = JSON.parse(userInfor);
  idAdminLogin.value = user.id;
});

const fetchStaff = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllBasic();
    if (Array.isArray(response.data.data)) {
      staff.value = response.data.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching staff:', error);
  } finally {
    isMiniLoading.value = false;
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedRole.value = 'Nhân viên';
  fetchStaff();
};

const removeStaff = async (id) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa Nhân viên này?');
  if (confirmDelete) {
    try {
      const data = {
        idAdmin: idAdminLogin.value,
      };

      const response = await remove(id, data);

      if (response.status === 403) {
        alert(response.data.message);
        return;
      }

      staff.value = staff.value.filter(staffMember => staffMember.id !== id);
      alert('Nhân viên đã được xóa!');
    } catch (error) {
      console.error('Error removing staff:', error);

      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Có lỗi xảy ra khi xóa Nhân viên. Vui lòng thử lại.');
      }
    }
  }
};


const viewStaff = async (staffMember) => {
  try {
    const response = await getById(staffMember.id);
    if (response.data) {
      staffDetail.value = response.data;
      showDetail.value = true;
    } else {
      throw new Error('Không tìm thấy thông tin Nhân viên');
    }
  } catch (error) {
    console.error('Error fetching staff details:', error);
    alert('Có lỗi xảy ra khi xem chi tiết Nhân viên.');
  }
};

const closeDetail = () => {
  showDetail.value = false;
  staffDetail.value = null;
};

const searchStaff = async () => {
  if (!searchQuery.value) {
    alert('Vui lòng nhập thông tin cần tìm kiếm.');
    return;
  }

  const filteredStaff = staff.value.filter(staffMember => 
    staffMember.username?.includes(searchQuery.value) ||
    staffMember.name?.includes(searchQuery.value) ||
    staffMember.email?.includes(searchQuery.value) ||
    staffMember.phone?.includes(searchQuery.value)
  );

  staff.value = filteredStaff.length ? filteredStaff : [];
  if (filteredStaff.length === 0) {
    alert('Không tìm thấy Nhân viên nào.');
  }
};

const addStaff = async (staffData) => {
  try {
    staffData.idAdmin = idAdminLogin.value;
    await add(staffData); 
    alert('Thêm Nhân viên thành công!');
    fetchStaff();
    closeAddModal();
  } catch (error) {
    console.error('Error adding staff:', error);
    alert('Có lỗi xảy ra khi thêm Nhân viên.');
  }
};

const showUpdateForm = (staffMember) => {
  selectedStaff.value = staffMember;
  showUpdateModal.value = true;
};

const updateStaff = async (updateStaff) => {
  try {
    updateStaff.idAdmin = idAdminLogin.value;
    const response = await update(updateStaff.id, updateStaff);
    if (response.status === 403) {
      alert(response.data.message);
      return;
    }
    alert('Cập nhật Nhân viên thành công!');
    fetchStaff();
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating staff:', error);

    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      alert('Có lỗi xảy ra khi cập nhật Nhân viên. Vui lòng thử lại.');
    }
  }
};

const lockStaff = async (staffMember) => {
  const confirmAction = confirm(`Bạn có chắc chắn muốn ${staffMember.status === '0' ? 'mở khóa' : 'khóa'} tài khoản Nhân viên này?`);
  if (confirmAction) {
    try {
      const data = {
        idAdmin: idAdminLogin.value,
        type: staffMember.status === '0' ? 'unfreeze' : 'freeze', // Điều chỉnh loại action
      };

      const response = await freezeApi(staffMember.id, data); // API sẽ nhận type là 'freeze' hoặc 'unfreeze'

      if (response.status === 403) {
        alert(response.data.message);
        return;
      }

      // Cập nhật lại trạng thái trong danh sách nhân viên sau khi khóa/mở khóa
      staff.value = staff.value.map(staff => 
        staff.id === staffMember.id ? { ...staff, status: staffMember.status === '0' ? 'online' : '0' } : staff
      );

      alert(`Tài khoản Nhân viên đã ${staffMember.status === '0' ? 'mở khóa' : 'được khóa'}!`);
    } catch (error) {
      console.error('Error locking/unlocking staff:', error);
      alert('Có lỗi xảy ra khi thực hiện thao tác này. Vui lòng thử lại.');
    }
  }
};



</script>
