<template>
  <div class="flex w-screen h-screen bg-gray-100">
    <Navbar />
    <div class="flex flex-col w-full p-6">
      <div class="flex flex-col mb-4">
        <h1 class="text-2xl font-bold mb-2">Quản lý phân quyền </h1>
        <div class="flex items-center mb-2">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập thông tin cần tìm kiếm..."
            class="border border-gray-300 rounded-lg p-2 mr-2 flex-grow focus:outline-none focus:ring focus:ring-yellow-500"
          />
          <button 
            class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition" 
            @click="searchRole" 
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
          <ion-icon name="add-outline"></ion-icon> Thêm phân quyền
        </button>
        <table v-if="roles.length > 0" class="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead class="bg-gray-100">
            <tr>
              <th class="border border-gray-300 p-2 text-left">ID</th>
              <th class="border border-gray-300 p-2 text-left">Tên</th>
              <th class="border border-gray-300 p-2 text-left">Số nhân viên</th>
              <th class="border border-gray-300 p-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-50">
              <td class="border border-gray-300 p-2 text-center">{{ role.id || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ role.name || '' }}</td>
              <td class="border border-gray-300 p-2 text-center">{{ role.staffs || 0 }}</td>
              <td class="border border-gray-300 p-2 text-center flex">
                <button 
                  @click="showUpdateForm(role)" 
                  class="flex items-center justify-center text-yellow-500 hover:text-white bg-transparent hover:bg-yellow-400 transition-all rounded-full p-2 mx-1" 
                  title="Cập nhật">
                  <ion-icon class="text-2xl" name="pencil-outline"></ion-icon>
                </button>
                <button 
                  @click="viewRole(role)" 
                  class="flex items-center justify-center text-blue-500 hover:text-white bg-transparent hover:bg-blue-400 transition-all rounded-full p-2 mx-1" 
                  title="Xem chi tiết">
                  <ion-icon class="text-2xl" name="person-outline"></ion-icon>
                </button>
                <button 
                  @click="removeRole(role.id)" 
                  class="flex items-center justify-center text-red-500 hover:text-white bg-transparent hover:bg-red-400 transition-all rounded-full p-2 mx-1" 
                  title="Xóa">
                  <ion-icon class="text-2xl" name="trash-outline"></ion-icon>
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
    <!-- <RoleDetail :role="roleDetail" @close="closeDetail" /> -->
     <RoleDetail :roleDetail="roleDetail" @close="closeDetail" />
  </div>
  <AddRole :show="showAddModal" @close="closeAddModal" @createRole="createRole" />
  <UpdateRole :show="showUpdateModal" :role="selectedRole" @close="closeUpdateModal" @updateRole="updateRole" />
</template>

<script setup>
import { ref, onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../../components/NavbarComponent.vue';
import RoleDetail from './DetailRole.vue';
import AddRole from './AddRole.vue';
import UpdateRole from './UpdateRole.vue';
import {
  addRoleApi,
  editRoleApi,
  getAllRoleApi,
  deleteRoleApi,
  getStaffByRoleApi
} from '@/services/modules/role.api';

const roles = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const selectedRole = ref('phân quyền');
const showDetail = ref(false);
const roleDetail = ref(null);
const showAddModal = ref(false);
const showUpdateModal = ref(false);
// const selectedRole = ref(null);
const idAdminLogin = ref(null);
const router = useRouter();

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
  fetchRoles();
});

const fetchRoles = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllRoleApi();
    if (Array.isArray(response.data.data)) {
      roles.value = response.data.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
    alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại! 🥲');
    roles.value = [];
    setTimeout(() => {
        router.push('/login');
    }, 2000);
  } finally {
    isMiniLoading.value = false;
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedRole.value = 'phân quyền';
  fetchRoles();
};

const removeRole = async (id) => {
  const confirmDelete = confirm('Bạn có chắc chắn muốn xóa phân quyền này?');
  if (confirmDelete) {
    try {
      const data = {
        idAdmin: idAdminLogin.value,
        id,
      }
      await deleteRoleApi(data);
      roles.value = roles.value.filter(role => role.id !== id);
      alert('Xóa ok');
    } catch (error) {
      console.error('Error removing role:', error);
      alert('Có lỗi xảy ra khi xóa phân quyền. Vui lòng thử lại.');
    }
  }
};

const viewRole = async (role) => {
  // try {
    const response = await getStaffByRoleApi(role.id);
    if (response.data && response.data.length > 0) {
      roleDetail.value = response.data;
      // console.log(roleDetail.value);
      showDetail.value = true;
    } else  if (response.data.length == 0){
      alert('Không có nhân viên nào.');
    } else {
      throw new Error('Không có nhân viên nào.');
    }
  // } catch (error) {
  //   console.error('Error fetching role details:', error);
  //   alert('Có lỗi xảy ra khi xem chi tiết phân quyền.');
  // }
};

const closeDetail = () => {
  showDetail.value = false;
  roleDetail.value = null;
};

const searchRole = async () => {
  if (!searchQuery.value) {
    alert('Vui lòng nhập thông tin cần tìm kiếm.');
    return;
  }

  const filteredRoles = roles.value.filter(role => 
    role.username?.includes(searchQuery.value) ||
    role.name?.includes(searchQuery.value) ||
    role.email?.includes(searchQuery.value) ||
    role.phone?.includes(searchQuery.value) ||
    role.address?.includes(searchQuery.value)
  );

  roles.value = filteredRoles.length ? filteredRoles : [];
  if (filteredRoles.length === 0) {
    alert('Không tìm thấy phân quyền nào.');
  }
};

const createRole = async (roleData) => {
  try {
    roleData.idAdmin = idAdminLogin.value;
    await addRoleApi(roleData); 
    console.log(roleData);
    alert('Thêm phân quyền thành công!');
    fetchRoles();
    closeAddModal();
  } catch (error) {
    console.error('Error adding role:', error);
    alert('Có lỗi xảy ra khi thêm phân quyền.');
  }
};

const showUpdateForm = (role) => {
  selectedRole.value = role;
  showUpdateModal.value = true;
};

const updateRole = async (updatedData) => {
  try {
    // console.log(updatedData);
    const idAdmin = idAdminLogin.value;
    const data = {
      idAdmin,
      ...updatedData
    }
    await editRoleApi(data);
    alert('Cập nhật phân quyền thành công!');
    fetchRoles();
    closeUpdateModal();
  } catch (error) {
    console.error('Error updating role:', error);
    alert('Có lỗi xảy ra khi cập nhật phân quyền.');
  }
};

onMounted(() => {
  const userInfor = localStorage.getItem('user');
  const user = JSON.parse(userInfor);
  idAdminLogin.value = user.id;
});
</script>

<style scoped>
/* Bỏ qua CSS riêng biệt vì đã sử dụng Tailwind */
</style>
