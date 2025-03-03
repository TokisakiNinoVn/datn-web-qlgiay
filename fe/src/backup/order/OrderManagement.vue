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
            :disabled="isMiniLoading || !searchQuery">
            <ion-icon name="search-outline"></ion-icon>
        </button>
        </div>
        <div class="flex space-x-2">
        <button 
            class="bg-blue-600 text-white flex items-center rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-150" 
            :disabled="isMiniLoading"
            @click="filterOrder">
            <ion-icon class="mr-2" name="filter-outline"></ion-icon>
            Lọc
        </button>
        <button 
            @click="resetFilters" 
            class="flex items-center bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-150">
            <ion-icon class="mr-1" name="refresh-outline"></ion-icon>
            Làm mới
        </button>
        </div>

        <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
            <tr>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">ID</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Tên khách hàng</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Username</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Ngày đặt hàng</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Tổng tiền</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Trạng thái</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Địa chỉ giao hàng</th>
                <th class="px-6 py-3 text-left text-gray-600 font-semibold">Phương thức thanh toán</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in order" :key="item.id" class="border-b">
                <td class="px-6 py-4">{{ item.id }}</td>
                <td class="px-6 py-4">{{ item.name }}</td>
                <td class="px-6 py-4">{{ item.username }}</td>
                <td class="px-6 py-4">{{ new Date(item.order_date).toLocaleString() }}</td>
                <td class="px-6 py-4">{{ item.total_amount }}</td>
                <!-- <td class="px-6 py-4">{{ item.status }}</td> -->
                <td v-if="item.status  === 'completed'" class="py-4 px-4 border-b border-gray-200">
                    <span>Hoàn thành</span>
                </td>
                <td v-else-if="item.status === 'pending'" class="py-4 px-4 border-b border-gray-200">
                    <span>Đang chờ</span>
                </td>
                <td v-else class="py-4 px-4 border-b border-gray-200">
                    <span>Không xác định</span>
                </td>
                <td class="px-6 py-4">{{ item.shipping_address }}</td>
                <td v-if="item.payment_method  === 'credit_card'" class="py-4 px-4 border-b border-gray-200">
                    <span>Thẻ tín dụng</span>
                </td>
                <td v-else-if="item.payment_method === 'paypal'" class="py-4 px-4 border-b border-gray-200">
                    <span>Paypal</span>
                </td>
                <td v-else-if="item.payment_method === 'cast'" class="py-4 px-4 border-b border-gray-200">
                    <span>Tiền mặt</span>
                </td>
                <td v-else-if="item.payment_method === 'bank_transfer'" class="py-4 px-4 border-b border-gray-200">
                    <span>Chuyển khoản ngân hàng</span>
                </td>
                <td v-else class="py-4 px-4 border-b border-gray-200">
                    <span>Khác</span>
                </td>
                <!-- <td class="px-6 py-4">{{ item.payment_method }}</td> -->
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
// import { useRouter } from 'vue-router';

// const router = useRouter();
const order = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');

// Fetch orders from API
onBeforeMount(() => {
    fetchOrder();
});

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
    // alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại! 🥲');
    // order.value = [];
    // setTimeout(() => {
    //     router.push('/login');
    // }, 2000);
    } finally {
    isMiniLoading.value = false;
    }
};

// Search method
const search = () => {
    if (searchQuery.value) {
    order.value = order.value.filter(item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.shipping_address.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    } else {
    fetchOrder();
    }
};

// Reset filters
const resetFilters = () => {
    searchQuery.value = '';
    fetchOrder();
};
</script>

<style scoped>
.table-header {
    background-color: #f8f9fa;
    color: #333;
}
.table-row {
    border-bottom: 1px solid #ddd;
}
</style>
