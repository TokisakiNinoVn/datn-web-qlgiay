<template>
    <div class="p-4 bg-white shadow-md rounded">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Thêm thiết bị</h2>
        
        <form @submit.prevent="addDevice" class="space-y-4">
            <div>
                <label class="block text-gray-700">Tên thiết bị:</label>
                <input v-model="device.name" type="text" class="w-full p-2 border rounded" required>
            </div>
            
            <div>
                <label class="block text-gray-700">Số lượng:</label>
                <input v-model.number="device.quantity" type="number" class="w-full p-2 border rounded" required>
            </div>
            
            <div>
                <label class="block text-gray-700">Giá:</label>
                <input v-model.number="device.price" type="number" class="w-full p-2 border rounded" required>
            </div>
            
            <div>
                <label class="block text-gray-700">Hình ảnh:</label>
                <input type="file" @change="handleFileUpload" class="w-full p-2 border rounded">
                <img v-if="device.image" :src="device.image" alt="Preview" class="w-16 h-16 object-cover mt-2">
            </div>
            
            <div class="flex gap-2">
                <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Thêm</button>
                <button type="button" @click="resetForm" class="px-4 py-2 bg-red-500 text-white rounded">Xóa</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";

const device = ref({ name: "", quantity: 1, price: 0, image: "" });

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            device.value.image = reader.result;
        };
        reader.readAsDataURL(file);
    }
};

const addDevice = () => {
    console.log("Thiết bị đã thêm:", device.value);
    resetForm();
};

const resetForm = () => {
    device.value = { name: "", quantity: 1, price: 0, image: "" };
};
</script>
