<template>
  <div>
    <button @click="editMode = !editMode">{{ editMode ? 'Cancel' : 'Edit' }}</button>

    <!-- Modal for editing voucher -->
    <div v-if="editMode" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button @click="editMode = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          &times;
        </button>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Cập nhật thông tin Voucher</h2>
        
        <form @submit.prevent="actionUpdateVoucher">
          <div class="mb-4">
            <label for="code" class="block text-gray-700 font-medium">Mã:</label>
            <input type="text" v-model="code" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="mb-4">
            <label for="startDate" class="block text-gray-700 font-medium">Ngày bắt đầu:</label>
            <input type="date" v-model="startDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="mb-4">
            <label for="endDate" class="block text-gray-700 font-medium">Ngày kết thúc:</label>
            <input type="date" v-model="endDate" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="mb-4">
            <label for="discountType" class="block text-sm font-medium text-gray-700">Hình thức giảm giá:</label>
            <select v-model="discountType" required 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="fixed">Mức tiền (Một số tiền cụ thể)</option>
              <option value="percentage">Phần trăm (%)</option>
            </select>
          </div>
          <div class="mb-4">
            <label for="discountAmount" class="block text-sm font-medium text-gray-700">
              {{ discountType === 'percentage' ? '(%)' : 'Số tiền' }}:
            </label>
            <input type="number" v-model="discountAmount" :min="discountType === 'percentage' ? 1 : null" 
               :max="discountType === 'percentage' ? 100 : null" required
               class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="mb-4">
            <label for="usageLimit" class="block text-gray-700 font-medium">Số lượt sử dụng:</label>
            <input type="number" v-model="usageLimit" required class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-medium">Mô tả:</label>
            <input type="text" v-model="description" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Update Voucher</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { updateVoucher } from '@/services/modules/voucher.api';

export default {
  props: {
    voucher: Object,
  },
  setup(props) {
    const code = ref(props.voucher.code);
    const startDate = ref(props.voucher.startDate);
    const endDate = ref(props.voucher.endDate);
    const discountType = ref(props.voucher.discountType);
    const discountAmount = ref(props.voucher.discountAmount);
    const usageLimit = ref(props.voucher.usageLimit);
    const description = ref(props.voucher.description || '');
    const editMode = ref(false);

    const actionUpdateVoucher = async () => {
      try {
        await updateVoucher(props.voucher.id, { 
          code: code.value, 
          startDate: startDate.value, 
          endDate: endDate.value, 
          discountType: discountType.value,
          discountAmount: discountAmount.value, 
          usageLimit: usageLimit.value,  
          description: description.value || null // Set to null if empty
        });
        editMode.value = false; // Exit edit mode after update
      } catch (error) {
        console.error('Error updating voucher:', error);
      }
    };

    return {
      code,
      startDate,
      endDate,
      discountType,
      discountAmount,
      usageLimit,
      description,
      editMode,
      actionUpdateVoucher,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
