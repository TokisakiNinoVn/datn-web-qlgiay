<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg w-1/2">
      <h2 class="text-xl font-bold mb-4">Thêm Nhân viên</h2>
      <form @submit.prevent="handleAdd">
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="Tên quyền - Bắt buộc" 
          class="border p-2 mb-2 w-full" 
          required 
        />
        <input 
          v-model="formData.description" 
          type="text" 
          placeholder="Ghi chú" 
          class="border p-2 mb-2 w-full" 
        />
        <div class="list-role mb-4">
          <button type="button" @click="selectAllRoles" class="bg-green-500 text-white px-2 py-1 rounded mr-2">Chọn hết</button>
          <button type="button" @click="deselectAllRoles" class="bg-red-500 text-white px-2 py-1 rounded">Bỏ chọn hết</button>
          <div v-for="(role, index) in roles" :key="index" class="mt-2">
            <label class="inline-flex items-center">
              <input 
                type="checkbox" 
                class="form-checkbox" 
                v-model="role.selected" 
              />
              <span class="ml-2">{{ role.name }}</span>
            </label>
          </div>
        </div>
        <button 
          type="submit" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Thêm quyền mới
        </button>
        <button 
          @click="close" 
          type="button" 
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 ml-2">
          Hủy
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmits } from 'vue';

defineProps(['show']);
const emit = defineEmits(['close', 'createRole']);

const formData = reactive({ name: '', description: '' });
const roles = reactive([
  { column: 'history_login', name: 'Lịch sử đăng nhập', selected: false }, // history_login
  { column: 'history_log', name: 'Lịch sử thay đổi', selected: false }, // history_log
  { column: 'manage_role', name: 'Quản lý quyền', selected: false }, // manage_role
  { column: 'manage_staff', name: 'Quản lý nhân viên', selected: false }, // manage_staff
  { column: 'manage_complaint', name: 'Quản lý khiếu nại', selected: false }, // manage_complaint
  { column: 'manage_user', name: 'Quản lý người dùng', selected: false }, // manage_user
  { column: 'manage_noti', name: 'Quản lý thông báo', selected: false }, // manage_noti
]);

const handleAdd = () => {
  const selectedRoles = roles
  .map(role => ({ column: role.column, selected: role.selected }));

  const payload = { ...formData, roles: selectedRoles };

  emit('createRole', payload);
  formData.name = '';
  formData.description = '';
  roles.forEach(role => (role.selected = false));
};

const close = () => {
  emit('close'); // Emit sự kiện đóng form
};

const selectAllRoles = () => {
  roles.forEach(role => (role.selected = true));
};

const deselectAllRoles = () => {
  roles.forEach(role => (role.selected = false));
};
</script>

<style scoped>
/* Bạn có thể thêm style cụ thể nếu cần */
</style>
