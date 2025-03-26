<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg w-1/4">
      <h2 class="text-xl font-bold text-black p-2 bg-yellow-400 mb-4">Cập nhật quyền người dùng</h2>
      <form @submit.prevent="handleUpdate">
        <input v-model="formData.name" type="text" placeholder="Tên" class="border p-2 mb-2 w-full" />
        <input v-model="formData.description" type="text" placeholder="Mô tả" class="border p-2 mb-2 w-full" />

        <!-- Checkboxes for permissions -->
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.history_log" /> Lịch sử đăng nhập
          </label>
        </div>
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.history_login" /> Lịch sử hoạt động
          </label>
        </div>
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.manage_complaint" /> Quản lý khiếu nại
          </label>
        </div>
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.manage_noti" /> Quản lý thông báo
          </label>
        </div>
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.manage_role" /> Quản lý vai trò
          </label>
        </div>
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.manage_staff" /> Quản lý nhân viên
          </label>
        </div>
        <div class="mb-2">
          <label>
            <input type="checkbox" v-model="formData.manage_user" /> Quản lý người dùng
          </label>
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cập nhật</button>
        <button @click="close" type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 ml-2">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['show', 'role'],
  emits: ['close', 'updateRole'],
  setup(props, { emit }) {
    const formData = ref({});

    watch(
      () => props.role,
      (newVal) => {
        if (!newVal) {
          formData.value = {
            name: '',
            description: '',
            history_log: false,
            history_login: false,
            manage_complaint: false,
            manage_noti: false,
            manage_role: false,
            manage_staff: false,
            manage_user: false,
          };
        } else {
          formData.value = {
            ...newVal,
            history_log: !!newVal.history_log,
            history_login: !!newVal.history_login,
            manage_complaint: !!newVal.manage_complaint,
            manage_noti: !!newVal.manage_noti,
            manage_role: !!newVal.manage_role,
            manage_staff: !!newVal.manage_staff,
            manage_user: !!newVal.manage_user,
          };
        }
      },
      { immediate: true }
    );

    const handleUpdate = () => {
      // Ném các giá trị đã được chọn vào mảng roles và bỏ nó đi trong formData
      const newData = { ...formData.value };
      delete newData.history_log;
      delete newData.history_login;
      delete newData.manage_complaint;
      delete newData.manage_noti;
      delete newData.manage_role;
      delete newData.manage_staff;
      delete newData.manage_user;
      delete newData.staffs;

      const updatedData = {
        ...newData,
        roles: [
          {history_log: formData.value.history_log ? 1 : 0},
          {history_login: formData.value.history_login ? 1 : 0},
          {manage_complaint: formData.value.manage_complaint ? 1 : 0},
          {manage_noti: formData.value.manage_noti ? 1 : 0},
          {manage_role: formData.value.manage_role ? 1 : 0},
          {manage_staff: formData.value.manage_staff ? 1 : 0},
          {manage_user: formData.value.manage_user ? 1 : 0},
        ]
      };
      emit('updateRole', updatedData);
    };

    const close = () => {
      emit('close');
    };

    return { formData, handleUpdate, close };
  },
};
</script>
