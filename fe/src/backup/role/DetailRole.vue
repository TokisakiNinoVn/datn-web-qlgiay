<template>
  <div v-if="roleDetail && roleDetail.length" class="flex flex-col bg-white p-4 rounded-lg shadow-md w-75">
    <h2 class="text-xl font-bold mb-4 bg-yellow-500 p-2">Các nhân viên</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="text-left p-2 border border-gray-300">ID</th>
          <th class="text-left p-2 border border-gray-300">Tên đăng nhập</th>
          <th class="text-left p-2 border border-gray-300">Tên</th>
          <th class="text-left p-2 border border-gray-300">Điện thoại</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="staff in roleDetail" :key="staff.id">
          <td class="text-left p-2 border border-gray-300">{{ staff.id }}</td>
          <td class="text-left p-2 border border-gray-300">{{ staff.username }}</td>
          <td class="text-left p-2 border border-gray-300">{{ staff.name }}</td>
          <td class="text-left p-2 border border-gray-300">{{ staff.phone }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="closeDetail" class="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
      Đóng
    </button>
  </div>
  <div v-else>
    <p>Không có dữ liệu nhân viên.</p>
  </div>
</template>


<script>
export default {
  props: {
    roleDetail: {
      type: Array,
      required: true,
    },
  },
  emits: ['close'],
  watch: {
    roleDetail(newVal) {
      console.log('roleDetail updated:', newVal);
    },
  },
  mounted() {
  // console.log('roleDetail mounted:', this.roleDetail); // Kiểm tra xem giá trị là gì
  if (!this.roleDetail || this.roleDetail.length === 0) {
    console.error('roleDetail is empty or undefined');
  }
},

  methods: {
    closeDetail() {
      this.$emit('close');
    },
  },
};
</script>



<style scoped>
/* Add custom styles here if needed */
p {
  text-align: left;
}
</style>
  