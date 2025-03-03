<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg w-1/4">
      <h2 class="text-xl font-bold text-black p-2 bg-yellow-400 mb-4">Cập nhật thông tin Nhân viên</h2>
      <form @submit.prevent="handleUpdate">
        <input v-model="formData.username" type="text" placeholder="Tên đăng nhập" class="border p-2 mb-2 w-full" disabled />
        <input v-model="formData.email" type="email" placeholder="Email" class="border p-2 mb-2 w-full" disabled />
        <input v-model="formData.name" type="text" placeholder="Tên" class="border p-2 mb-2 w-full" required />
        <input v-model="formData.phone" type="text" placeholder="Điện thoại" class="border p-2 mb-2 w-full" />
        <input v-model="formData.address" type="text" placeholder="Địa chỉ" class="border p-2 mb-2 w-full" />
        <select v-model="formData.gender" class="border p-2 mb-2 w-full">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
          <option value="Khác">Khác</option>
        </select>
        <input v-model="formData.note" type="text" placeholder="Ghi chú" class="border p-2 mb-2 w-full" />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cập nhật</button>
        <button @click="close" type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 ml-2">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: ['show', 'customer'],
  emits: ['close', 'updateCustomer'],
  setup(props, { emit }) {
    const formData = ref({});

    watch(
      () => props.customer,
      (newVal) => {
        formData.value = { ...newVal };
      },
      { immediate: true }
    );

    const handleUpdate = () => {
      emit('updateCustomer', formData.value);
    };

    const close = () => {
      emit('close');
    };

    return { formData, handleUpdate, close };
  },
};
</script>
