<template>
  <div v-if="staff" class="flex flex-col bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
    <!-- Hồ sơ cá nhân -->
    <div class="flex items-center mb-4">
      <img 
        src="../../../src/assets/avatar-staff.png"
        alt="Avatar" 
        class="w-24 h-24 rounded-full border-2 border-yellow-500 mr-4"
      />
      <div class="flex flex-col">
        <h2 class="text-2xl font-semibold text-gray-800">{{ staff.name }}</h2>
        <p class="text-md text-gray-600">{{ staff.role }}</p>
      </div>
    </div>

    <!-- Chi tiết hồ sơ -->
    <table class="w-full text-left">
      <tbody>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">ID:</td>
          <td class="p-2 border-b">{{ staff.id }}</td>
        </tr>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">Tên đăng nhập:</td>
          <td class="p-2 border-b">{{ staff.username }}</td>
        </tr>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">Email:</td>
          <td class="p-2 border-b">{{ staff.email }}</td>
        </tr>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">Điện thoại:</td>
          <td class="p-2 border-b">{{ staff.phone }}</td>
        </tr>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">Địa chỉ:</td>
          <td class="p-2 border-b">{{ staff.address }}</td>
        </tr>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">Giới tính:</td>
          <td class="p-2 border-b">{{ staff.gender }}</td>
        </tr>
        <tr>
          <td class="font-semibold text-gray-700 p-2 border-b">Ghi chú:</td>
          <td class="p-2 border-b">{{ staff.note }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Nút đóng -->
    <button 
      @click="closeDetail" 
      class="mt-6 bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none">
      Đóng
    </button>
  </div>
</template>

<script>
export default {
  props: {
    staff: { // Changed from 'customer' to 'staff'
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  methods: {
    closeDetail() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
/* Tùy chỉnh kiểu dáng cho hồ sơ */
table {
  width: 100%;
  border-collapse: collapse;
}
td {
  padding: 12px;
}
th, td {
  text-align: left;
}
</style>
