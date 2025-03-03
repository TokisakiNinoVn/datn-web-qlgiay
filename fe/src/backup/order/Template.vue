<template>
    <div class="flex w-screen h-screen bg-gray-100">
      <Navbar />
      <div class="flex flex-col w-full p-8 space-y-6">
        <h2 class="text-3xl font-semibold text-gray-800">Quản lý các đơn hàng</h2>
        <div class="flex items-center space-x-4">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Nhập thông tin cần tìm kiếm..."
            class="border border-gray-300 rounded-lg p-3 flex-grow focus:outline-none focus:ring focus:ring-yellow-500 transition duration-150"
          />
          <button
            class="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-150"
            @click="search"
            :disabled="isMiniLoading || !searchQuery"
          >
            <ion-icon name="search-outline"></ion-icon>
          </button>
        </div>
        <div class="flex space-x-2">
          <button
            class="bg-blue-600 text-white flex items-center rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-150"
            :disabled="isMiniLoading"
            @click="filterOrder"
          >
            <ion-icon class="mr-2" name="filter-outline"></ion-icon>
            Lọc
          </button>
          <button
            @click="resetFilters"
            class="flex items-center bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-150"
          >
            <ion-icon class="mr-1" name="refresh-outline"></ion-icon>
            Làm mới
          </button>
        </div>
  
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th class="px-4 py-2 border-b">ID</th>
                <th class="px-4 py-2 border-b">User ID</th>
                <th class="px-4 py-2 border-b">Order Date</th>
                <th class="px-4 py-2 border-b">Total Amount</th>
                <th class="px-4 py-2 border-b">Status</th>
                <th class="px-4 py-2 border-b">Shipping Address</th>
                <th class="px-4 py-2 border-b">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="orderItem in order" :key="orderItem.id" class="text-center">
                <td class="px-4 py-2 border-b">{{ orderItem.id }}</td>
                <td class="px-4 py-2 border-b">{{ orderItem.user_id }}</td>
                <td class="px-4 py-2 border-b">{{ new Date(orderItem.order_date).toLocaleString() }}</td>
                <td class="px-4 py-2 border-b">{{ orderItem.total_amount }}</td>
                <td class="px-4 py-2 border-b">{{ orderItem.status }}</td>
                <td class="px-4 py-2 border-b">{{ orderItem.shipping_address }}</td>
                <td class="px-4 py-2 border-b">{{ orderItem.payment_method }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onBeforeMount } from 'vue';
  import { getAll } from '@/services/modules/order.api';
  import Navbar from '@/components/NavbarComponent.vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const order = ref([]);
  const isMiniLoading = ref(false);
  const searchQuery = ref('');
  
  // Gọi API để lấy dữ liệu các đơn hàng
  onBeforeMount(() => {
    fetchOrder();
  });
  
  // Tải các đơn hàng từ API
  const fetchOrder = async () => {
    isMiniLoading.value = true;
    try {
      const response = await getAll();
      if (Array.isArray(response.data)) {
        order.value = response.data;
      } else {
        throw new Error('Dữ liệu không phải là một mảng');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại! 🥲');
      order.value = [];
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } finally {
      isMiniLoading.value = false;
    }
  };
  
  // Phương thức tìm kiếm
  const search = () => {
    if (searchQuery.value) {
      order.value = order.value.filter(orderItem =>
        orderItem.shipping_address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        orderItem.status.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    } else {
      fetchOrder();
    }
  };
  
  // Phương thức làm mới các bộ lọc
  const resetFilters = () => {
    searchQuery.value = '';
    fetchOrder();
  };
  </script>
  
  <style scoped>
  /* Add additional styles if needed */
  </style>
  