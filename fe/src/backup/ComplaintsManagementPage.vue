<template>
  <div class="flex w-screen h-screen bg-gray-100">
    <Navbar />
    <div class="flex flex-col w-full p-8 space-y-6">
      <h2 class="text-3xl font-semibold text-gray-800">Quản lý các khiếu nại</h2>
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
          @click="filterResponded"
        >
          <ion-icon class="mr-2" name="filter-outline"></ion-icon>
          Lọc theo đã phản hồi
        </button>
        <button
          class="bg-blue-600 text-white flex items-center rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-150"
          :disabled="isMiniLoading"
          @click="filterUnresponded"
        >
          <ion-icon class="mr-2" name="filter-outline"></ion-icon>
          Lọc theo chưa phản hồi
        </button>

        <button
          @click="resetFilters"
          class="flex items-center bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition duration-150"
        >
          <ion-icon class="mr-1" name="refresh-outline"></ion-icon>
          Làm mới
        </button>
      </div>

      <!-- <div class="overflow-x-auto"> -->
        <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-400 border-collapse">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 border-b-2 border-gray-500 text-left text-gray-700">Tên khách hàng</th>
              <th class="py-2 px-4 border-b-2 border-gray-500 text-left text-gray-700">Mô tả</th>
              <th class="py-2 px-4 border-b-2 border-gray-500 text-left text-gray-700">Trạng thái</th>
              <th class="py-2 px-4 border-b-2 border-gray-500 text-left text-gray-700">Ngày tạo</th>
              <th class="py-2 px-4 border-b-2 border-gray-500 text-left text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="complaint in complaints"
              :key="complaint.id"
              class="hover:bg-gray-100 transition duration-150 border-b border-gray-300"
            >
              <td class="py-4 px-4 border-r border-gray-300">
                {{ complaint.name }} ({{ complaint.username }})
              </td>
              <td class="py-4 px-4 border-r border-gray-300">{{ complaint.description }}</td>
              <td class="py-4 px-4 border-r border-gray-300">
                <span v-if="complaint.status === 0">Mới</span>
                <span v-else-if="complaint.status === 1">Đã có phản hồi</span>
                <span v-else>Không xác định</span>
              </td>
              <td class="py-4 px-4 border-r border-gray-300">
                {{ new Date(complaint.createAt).toLocaleDateString('vi-VN') }}
              </td>
              <td class="py-4 px-4">
                <button
                  class="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition duration-150"
                  @click="openResponseBox(complaint.id)"
                  :disabled="isMiniLoading || complaint.status === 'responded'"
                >
                  Tạo phản hồi
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="responseBoxVisible"
          class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white rounded-lg shadow-lg p-6 space-y-4 w-96">
            <h3 class="text-xl font-semibold text-gray-800">Thêm phản hồi</h3>
            <textarea
              v-model="currentResponseText"
              placeholder="Nhập phản hồi của bạn tại đây..."
              class="w-full border border-gray-300 rounded-lg p-2 resize-none"
              rows="4"
            ></textarea>
            <div class="flex justify-end space-x-2">
              <button
                class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-150"
                @click="closeResponseBox"
              >
                Hủy
              </button>
              <button
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                @click="submitResponse"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { getAll, createApi } from '@/services/modules/complaint.api';
import Navbar from '@/components/NavbarComponent.vue';

const complaints = ref([]);
const isMiniLoading = ref(false);
const searchQuery = ref('');
const responseBoxVisible = ref(false);
const currentComplaintId = ref(null);
const currentResponseText = ref('');

onBeforeMount(() => {
  fetchComplaints();
});

const fetchComplaints = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAll();
    complaints.value = response.data.data.map((complaint) => ({
      ...complaint,
      response: '',
    }));
  } catch (error) {
    console.error('Error fetching complaints:', error);
    complaints.value = [];
  } finally {
    isMiniLoading.value = false;
  }
};

const openResponseBox = (complaintId) => {
  currentComplaintId.value = complaintId;
  currentResponseText.value = '';
  responseBoxVisible.value = true;
};

const closeResponseBox = () => {
  responseBoxVisible.value = false;
  currentComplaintId.value = null;
  currentResponseText.value = '';
};

const submitResponse = async () => {
  if (!currentResponseText.value.trim()) {
    alert('Phản hồi không được để trống.');
    return;
  }
  isMiniLoading.value = true;
  try {
    const complaint = complaints.value.find((c) => c.id === currentComplaintId.value);
    const data = {
      idUser: complaint?.id_user || '',
      description: currentResponseText.value.trim(),
      idComplaint: currentComplaintId.value,
    };
    await createApi(data);
    alert('Phản hồi đã được gửi thành công!');
    closeResponseBox();
    fetchComplaints();
  } catch (error) {
    console.error('Error sending response:', error);
    alert('Có lỗi xảy ra khi gửi phản hồi.');
  } finally {
    isMiniLoading.value = false;
  }
};

const filterResponded = () => {
  complaints.value = complaints.value.filter((c) => c.status === 1);
};

const filterUnresponded = () => {
  complaints.value = complaints.value.filter((c) => c.status === 0);
};

const search = () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return;
  complaints.value = complaints.value.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.username.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
  );
};

const resetFilters = () => {
  searchQuery.value = '';
  fetchComplaints();
};

</script>


<style scoped>
.complaint-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
textarea {
  width: 100%;
  margin: 5px 0;
}
button {
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
</style>
