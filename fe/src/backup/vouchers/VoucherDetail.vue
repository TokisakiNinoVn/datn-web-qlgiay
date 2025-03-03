<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div class="voucher-detail bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Chi tiết Voucher</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="font-semibold">ID:</span>
          <span>{{ voucher.id }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Mã:</span>
          <span>{{ voucher.code }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Loại giảm giá:</span>
          <span>{{ voucher.discount_type === 'percentage' ? 'Phần trăm' : 'Tiền' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Số tiền giảm:</span>
          <span>{{ voucher.discount_type === 'percentage' ? voucher.discount_amount + '%' : voucher.discount_amount }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Ngày bắt đầu:</span>
          <span>{{ formatDate(voucher.start_date) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Ngày kết thúc:</span>
          <span>{{ formatDate(voucher.end_date) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Giới hạn sử dụng:</span>
          <span>{{ voucher.usage_limit }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Số lượt đã sử dụng:</span>
          <span>{{ voucher.used_count }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Trạng thái:</span>
          <span>{{ voucherStatus }}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Mô tả:</span>
          <span>{{ voucher.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  voucher: {
    type: Object,
    required: true
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const voucherStatus = computed(() => {
  if (props.voucher.start_date === props.voucher.end_date) return 'Đã hết hạn';
  if (props.voucher.usage_limit === props.voucher.used_count) return 'Đã hết lượt dùng';
  return props.voucher.is_active === 1 ? 'Đang hoạt động' : 'Đã hết hạn';
});
</script>

<style scoped>
.voucher-detail {
  max-width: 500px; /* You can adjust this width */
  margin: auto; /* Center the modal */
  padding: 20px; /* Add some padding */
  border-radius: 10px; /* Rounded corners */
  background-color: white; /* White background */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Shadow effect */
}
</style>
