<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">Thêm Thông Báo Mới</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium">Tiêu đề</label>
          <input v-model="title" type="text" class="border border-gray-300 rounded-lg p-2 w-full" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">Nội dung</label>
          <textarea v-model="message" class="border border-gray-300 rounded-lg p-2 w-full"></textarea>
        </div>
        <div class="flex space-x-4">
          <button @click="addNotification" class="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-150">
            Lưu
          </button>
          <button @click="$emit('close')" class="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-150">
            Hủy
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
//   import { ref } from 'vue';
  import { add } from '@/services/modules/notification.api';
  
  export default {
    emits: ['notificationAdded', 'close'],
    data() {
      return {
        title: '',
        message: ''
      };
    },
    methods: {
      async addNotification() {
        try {
          await add({ title: this.title, message: this.message });
          this.title = '';
          this.message = '';
          alert('Thông báo đã được thêm!');
          // Emit events to notify parent component
          this.$emit('notificationAdded');
          this.$emit('close');
        } catch (error) {
          console.error('Error adding notification:', error);
        }
      }
    }
  };
  </script>
  