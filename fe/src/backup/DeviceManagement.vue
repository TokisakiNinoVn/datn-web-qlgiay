<template>
    <div class="flex w-screen min-h-screen bg-gray-100">
        <Navbar />
        <div class="flex flex-col w-full p-6 max-w-3xl mx-auto bg-white shadow-md rounded">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Quản lý thiết bị - Phòng {{ room?.name }}</h2>
            
            <div v-if="loading" class="text-center text-gray-700">Đang tải danh sách thiết bị...</div>
            <div v-else-if="devices.length > 0">
                <div v-for="device in devices" :key="device.id" class="flex items-center gap-4 p-3 border-b">
                    <img v-if="device.images.length > 0" :src="device.images[0].url" alt="Thiết bị" class="w-16 h-16 object-cover rounded">
                    <div>
                        <p><strong>{{ device.name }}</strong></p>
                        <p>Giá: {{ Number(device.price).toLocaleString() }} VNĐ</p>
                        <p>Số lượng: {{ device.quantity }}</p>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-gray-500">Không có thiết bị nào trong phòng này.</div>
            
            <div class="mt-4 flex gap-2">
                <router-link to="/room-management" class="px-4 py-2 bg-gray-500 text-white rounded">
                    <ion-icon name="chevron-back-outline"></ion-icon>
                    Quay lại
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/NavbarComponent.vue";
import { getRoomByIdApi } from "@/services/modules/warehouse.api";

const route = useRoute();
const room = ref(null);
const devices = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await getRoomByIdApi(route.params.id);
        room.value = response.data;
        devices.value = response.data.devices || [];
    } catch (error) {
        console.error("Lỗi khi tải thiết bị:", error);
    } finally {
        loading.value = false;
    }
});
</script>
