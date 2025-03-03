<template>
  <div class="flex w-screen h-screen bg-gray-100">
    <Navbar />
    <div class="flex flex-col w-full p-8 space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản lý thông báo</h2>
      
      <!-- Search and Filter -->
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
          @click="resetFilters" 
          class="flex items-center bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-150">
          <ion-icon class="mr-1" name="refresh-outline"></ion-icon>
          Làm mới
        </button>

        <!-- Button to open add notification form -->
        <button @click="showAddNotification = true" class="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition duration-150">
          Thêm thông báo mới
        </button>
      </div>

      <!-- Danh sách thông báo -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-3 px-4 text-left">ID</th>
              <th class="py-3 px-4 text-left">Tiêu đề</th>
              <th class="py-3 px-4 text-left">Nội dung</th>
              <th class="py-3 px-4 text-left">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="notify in notification" :key="notify.id">
              <td class="py-3 px-4">{{ notify.id }}</td>
              <td class="py-3 px-4">{{ notify.title }}</td>
              <td class="py-3 px-4">{{ notify.message }}</td>
              <td class="py-3 px-4">{{ new Date(notify.createdAt).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Component form to add new notification -->
      <AddNotificationForm v-if="showAddNotification" @notificationAdded="fetchNotification" @close="showAddNotification = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import AddNotificationForm from './AddNotification.vue';
import { getAll } from '@/services/modules/notification.api';

const notification = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const showAddNotification = ref(false);

onBeforeMount(() => {
  fetchNotification();
});

const fetchNotification = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAll();
    notification.value = response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  } finally {
    isMiniLoading.value = false;
  }
};

const search = () => {
  if (searchQuery.value) {
    notification.value = notification.value.filter(notify =>
      notify.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      notify.message.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  } else {
    fetchNotification();
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  fetchNotification();
};
</script>
