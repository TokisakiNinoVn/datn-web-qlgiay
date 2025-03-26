<template>
  <div class="flex w-screen h-screen bg-gray-100">
    <Navbar />
    <div class="flex flex-col w-full p-6">
      <div class="flex flex-col mb-4">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Quản lý Voucher</h1>
        
        <!-- Search Bar -->
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm theo ID hoặc Mã"
          @input="searchVouchers"
          class="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <!-- Filter Buttons -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button @click="filterExpiredVouchers" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Hiển thị đã hết hạn
          </button>
          <button @click="filterActiveVouchers" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Hiển thị đang hoạt động
          </button>
          <button @click="filterUsableVouchers" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Hiển thị còn lượt sử dụng
          </button>
          <button @click="filterUsedOutVouchers" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Hiển thị đã hết lượt sử dụng
          </button>
        </div>

        <!-- Create New Voucher Button -->
        <button @click="showCreateVoucherModal = true" 
                class="px-4 py-2 mb-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Tạo voucher mới
        </button>

        <!-- Vouchers Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr class="bg-gray-100 text-gray-700 text-sm font-semibold">
                <th class="py-3 px-4 border-b">ID</th>
                <th class="py-3 px-4 border-b">Mã Voucher</th>
                <th class="py-3 px-4 border-b">Loại giảm giá</th>
                <th class="py-3 px-4 border-b">Số tiền giảm</th>
                <th class="py-3 px-4 border-b">Ngày bắt đầu</th>
                <th class="py-3 px-4 border-b">Ngày kết thúc</th>
                <th class="py-3 px-4 border-b">Giới hạn sử dụng</th>
                <th class="py-3 px-4 border-b">Số lượt đã sử dụng</th>
                <th class="py-3 px-4 border-b">Trạng thái</th>
                <th class="py-3 px-4 border-b">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="voucher in vouchers" :key="voucher.id" class="hover:bg-gray-50">
                <td class="py-2 px-4 border-b text-center">{{ voucher.id }}</td>
                <td class="py-2 px-4 border-b text-center">{{ voucher.code }}</td>
                <td class="py-2 px-4 border-b text-center">
                  <span v-if="voucher.discount_type === 'percentage'">Phần trăm</span>
                  <span v-else>Tiền</span>
                </td>
                <td class="py-2 px-4 border-b text-center">
                  {{ voucher.discount_type === 'percentage' ? voucher.discount_amount + '%' : voucher.discount_amount }}
                </td>
                <td class="py-2 px-4 border-b text-center">{{ formatDate(voucher.start_date) }}</td>
                <td class="py-2 px-4 border-b text-center">{{ formatDate(voucher.end_date) }}</td>
                <td class="py-2 px-4 border-b text-center">{{ voucher.usage_limit }}</td>
                <td class="py-2 px-4 border-b text-center">{{ voucher.used_count }}</td>
                <td class="py-2 px-4 border-b text-center">
                  <span v-if="voucher.start_date === voucher.end_date">Đã hết hạn</span>
                  <span v-else-if="voucher.usage_limit === voucher.used_count">Đã hết lượt dùng</span>
                  <span v-else>{{ voucher.is_active === 1 ? 'Đang hoạt động' : 'Đã hết hạn' }}</span>
                </td>
                <td class="py-2 px-4 border-b text-center">
                  <VoucherUpdate :voucher="voucher" @voucherUpdated="fetchVouchers" />
                  <button @click="deleteVoucher(voucher.id)" class="ml-2 px-2 py-1 text-red-500 hover:bg-red-100 rounded-lg">
                    <ion-icon name="remove-outline"></ion-icon>
                    Xóa
                  </button>
                  <button @click="showVoucherDetail(voucher)" class="ml-2 px-2 py-1 text-blue-500 hover:bg-blue-100 rounded-lg">
                    <ion-icon name="eye-outline"></ion-icon>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Voucher Modal -->
      <div v-if="showCreateVoucherModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <button @click="showCreateVoucherModal = false" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            &times;
          </button>
          <VoucherCreate v-if="showCreateVoucherModal" @voucherCreated="handleVoucherCreated" @close="showCreateVoucherModal = false" />
        </div>
      </div>
    </div>
  </div>
  <VoucherDetail 
    v-if="selectedVoucher" 
    :voucher="selectedVoucher" 
    @close="selectedVoucher = null" 
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  getAllVouchers,
  searchVoucher,
  filterExpiredVouchers as fetchExpiredVouchers,
  filterActiveVouchers as fetchActiveVouchers,
  filterUsableVouchers as fetchUsableVouchers,
  filterUsedOutVouchers as fetchUsedOutVouchers,
  deleteVoucher as deleteVoucherAPI,
} from '@/backup/voucher.api';
import VoucherCreate from './VoucherCreate.vue';
import VoucherUpdate from './VoucherUpdate.vue';
import VoucherDetail from './VoucherDetail.vue'; 
import Navbar from '../../components/NavbarComponent.vue';
// import { useRouter } from 'vue-router';

const vouchers = ref([]);
const searchQuery = ref('');
const showCreateVoucherModal = ref(false);
// const router = useRouter();
const selectedVoucher = ref(null);
const fetchVouchers = async () => {
  try {
    const response = await getAllVouchers();
    vouchers.value = response.data;
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    // alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại! 🥲');
    // vouchers.value = [];
    // setTimeout(() => {
    //     router.push('/login');
    // }, 2000);
  }
};

const searchVouchers = async () => {
  if (searchQuery.value) {
    const response = await searchVoucher(searchQuery.value);
    vouchers.value = response.data;
  } else {
    fetchVouchers();
  }
};

const filterExpiredVouchers = async () => {
  const response = await fetchExpiredVouchers();
  vouchers.value = response.data;
};

const filterActiveVouchers = async () => {
  const response = await fetchActiveVouchers();
  vouchers.value = response.data;
};

const filterUsableVouchers = async () => {
  const response = await fetchUsableVouchers();
  vouchers.value = response.data;
};

const filterUsedOutVouchers = async () => {
  const response = await fetchUsedOutVouchers();
  vouchers.value = response.data;
};

const deleteVoucher = async (id) => {
  try {
    await deleteVoucherAPI(id);
    fetchVouchers();
  } catch (error) {
    console.error('Error deleting voucher:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const handleVoucherCreated = () => {
  fetchVouchers();
  showCreateVoucherModal.value = false;
  
};
const showVoucherDetail = (voucher) => {
  selectedVoucher.value = voucher;
};
onMounted(fetchVouchers);
</script>

<style scoped>
/* Additional styles, if needed */
</style>
