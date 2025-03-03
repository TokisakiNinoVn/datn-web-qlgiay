<template>
  <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Tạo voucher mới</h2>
    <form @submit.prevent="createVoucher" class="space-y-4">
      <div>
        <label for="code" class="block text-sm font-medium text-gray-700">Mã code:</label>
        <input type="text" v-model="code" required 
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>
      
      <div>
        <label for="discountType" class="block text-sm font-medium text-gray-700">Hình thức giảm giá:</label>
        <select v-model="discountType" required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="fixed">Mức tiền (Một số tiền cụ thể)</option>
                <option value="percentage">Phần trăm (%)</option>
        </select>
      </div>
      
      <div>
        <label for="discountAmount" class="block text-sm font-medium text-gray-700">
          {{ discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount' }}:
        </label>
        <input type="number" v-model="discountAmount" :min="discountType === 'percentage' ? 1 : null" 
               :max="discountType === 'percentage' ? 100 : null" required
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700">Ngày bắt đầu:</label>
        <input type="date" v-model="startDate" required 
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label for="endDate" class="block text-sm font-medium text-gray-700">Ngày kết thúc:</label>
        <input type="date" v-model="endDate" required 
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label for="usageLimit" class="block text-sm font-medium text-gray-700">Giới hạn lượt sử dụng:</label>
        <input type="number" v-model="usageLimit" required 
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Mô tả:</label>
        <textarea v-model="description" rows="3" 
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      <button type="submit" 
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Phát hành voucher
      </button>
    </form>

    <button @click="closeForm" 
            class="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
      Đóng
    </button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { addVoucher } from '@/services/modules/voucher.api';

export default {
  props: ['show'],
  emits: ['voucherCreated', 'close'],
  setup(props, { emit }) {
    const code = ref('');
    const discountType = ref('fixed');
    const discountAmount = ref(0);
    const startDate = ref('');
    const endDate = ref('');
    const usageLimit = ref(0);
    const description = ref('');

    const createVoucher = async () => {
      if (new Date(startDate.value) >= new Date(endDate.value)) {
        alert('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
        return;
      }
      if (discountType.value === 'percentage' && (discountAmount.value < 1 || discountAmount.value > 99)) {
        alert('Phần trăm giảm giá phải nằm trong khoảng từ 1 đến 99.');
        return;
      }

      try {
        await addVoucher({ 
          code: code.value, 
          discountType: discountType.value, 
          discountAmount: discountAmount.value, 
          startDate: startDate.value, 
          endDate: endDate.value, 
          usageLimit: usageLimit.value, 
          description: description.value 
        });
        emit('voucherCreated'); // Emit event to notify parent component
        // Reset form fields
        code.value = '';
        discountType.value = 'fixed';
        discountAmount.value = 0;
        startDate.value = '';
        endDate.value = '';
        usageLimit.value = 0;
        description.value = '';
      } catch (error) {
        console.error('Error creating voucher:', error);
      }
    };

    const closeForm = () => {
      emit('close'); // Emit the close event
    };

    return {
      code,
      discountType,
      discountAmount,
      startDate,
      endDate,
      usageLimit,
      description,
      createVoucher,
      closeForm,
    };
  },
};
</script>

<style scoped>
/* Additional styles, if needed */
</style>
