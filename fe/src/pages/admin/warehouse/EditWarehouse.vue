<template>
    <div v-if="visible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
        <div class="modal-header">
        <h2>Chỉnh sửa kho: {{ editedWarehouse.name || 'Không có tên' }}</h2>
        <button @click="closeModal" class="modal-close-btn">
            <i class="fas fa-times"></i>
        </button>
        </div>
        <form @submit.prevent="submitEdit" class="modal-body">
        <div class="form-group">
            <label for="name" class="form-label">
            <i class="fas fa-warehouse mr-2"></i> Tên kho
            </label>
            <input
            type="text"
            id="name"
            v-model="editedWarehouse.name"
            class="form-input"
            placeholder="Nhập tên kho"
            required
            />
        </div>

        <div class="form-group">
            <label for="address" class="form-label">
            <i class="fas fa-map-marker-alt mr-2"></i> Địa chỉ
            </label>
            <input
            type="text"
            id="address"
            v-model="editedWarehouse.address"
            class="form-input"
            placeholder="Nhập địa chỉ kho"
            required
            />
        </div>

        <div class="form-group">
            <label for="description" class="form-label">
            <i class="fas fa-info-circle mr-2"></i> Mô tả
            </label>
            <textarea
            id="description"
            v-model="editedWarehouse.description"
            class="form-textarea"
            placeholder="Nhập các mô tả kho (nếu có)"
            ></textarea>
        </div>

        <div style="display: none;" class="form-group">
            <label for="idManager" class="form-label">
            <i class="fas fa-user-tie mr-2"></i> Người quản lý
            </label>
            <div class="select-wrapper">
                <input
                    type="text"
                    v-model="managerSearch"
                    class="search-manager-input"
                    placeholder="Tìm kiếm người quản lý..."
                    @focus="showDropdown = true"
                    @blur="hideDropdownWithDelay"
                />
                <div v-if="showDropdown" class="manager-dropdown">
                    <div
                        v-for="manager in filteredManagers"
                        :key="manager.id"
                        @click="selectManager(manager)"
                        class="manager-option"
                    >
                    {{ manager.full_name }} ({{ manager.role }})
                    </div>
                    <div v-if="filteredManagers.length === 0" class="no-results">
                    Không tìm thấy người quản lý
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button type="button" @click="closeModal" class="cancel-btn">
            Hủy
            </button>
            <button type="submit" class="save-btn">
            <i class="fas fa-save mr-2"></i> Lưu thay đổi
            </button>
        </div>
        </form>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, createApp } from "vue";
import { updateWarehouseApi } from "@/services/modules/warehouse.api";
import { getAllUserWithRoleApi } from "@/services/modules/user.api";
import { defineProps, defineEmits } from "vue";
import NotificationComponent from '@/components/NotificationComponent.vue';

const props = defineProps({
    warehouse: {
        type: Object,
        default: () => ({}),
    },
    visible: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'updated']);

const editedWarehouse = ref({
    id: null,
    name: "",
    address: "",
    description: "",
    idManager: null,
});

const managers = ref([]);
const managerSearch = ref("");
const showDropdown = ref(false);
const selectIdManager = ref(null);

// Cập nhật editedWarehouse khi props.warehouse thay đổi
watch(() => props.warehouse, (newWarehouse) => {
    if (newWarehouse) {
        editedWarehouse.value = { ...newWarehouse };
        managerSearch.value = newWarehouse.manager_info ? newWarehouse.manager_info.full_name : "";
    } else {
        editedWarehouse.value = { id: null, name: "", address: "", description: "", idManager: null };
        managerSearch.value = "";
    }
}, { immediate: true });

onMounted(async () => {
    try {
        const response = await getAllUserWithRoleApi();
        managers.value = response.data.filter(user => user.role_code === "manager");
        // managers.value = response.data.filter(user => user.role_code === "manager" || user.role_code === "staff" || user.role_id === 2 || user.role_id === 3);

    } catch (error) {
    console.error("Error fetching managers:", error);
    managers.value = [];
    }
});

const filteredManagers = computed(() => {
    const query = managerSearch.value.toLowerCase();
    return managers.value.filter(manager =>
        manager.full_name.toLowerCase().includes(query)
    );
});

const selectManager = (manager) => {
    editedWarehouse.value.idManager = manager.id;
    selectIdManager.value = manager.id;
    managerSearch.value = manager.full_name;
    showDropdown.value = false;
};

const hideDropdownWithDelay = () => {
    setTimeout(() => {
    showDropdown.value = false;
    }, 200);
};

const submitEdit = async () => {
  try {
    const payload = {
      id: editedWarehouse.value.id,
      name: editedWarehouse.value.name?.trim(),
      address: editedWarehouse.value.address?.trim(),
      description: editedWarehouse.value.description?.trim() || null,
    };

    // Chỉ thêm idManager nếu nó đã được thay đổi
    if (editedWarehouse.value.idManager !== null) {
      payload.idManager = editedWarehouse.value.idManager;
    }

    const response = await updateWarehouseApi(payload);

    if (response.data.code === 200) {
      showNotification("Thông tin kho đã được cập nhật thành công!", "success");
      emit("updated");
      closeModal();
    } else {
      showNotification("Cập nhật kho không thành công!", "error");
    }
  } catch (error) {
    console.error("Error updating warehouse:", error);

    if (error.response && error.response.status === 400) {
      const errorMessage = error.response.data?.message || "Cập nhật kho thất bại!";
      showNotification(`Lỗi: ${errorMessage}`, "error");
    } else {
      showNotification("Có lỗi xảy ra khi cập nhật kho!", "error");
    }
  }
};


const closeModal = () => {
    emit('close');
};

const showNotification = (message, type) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp(NotificationComponent, { message, type });
  // eslint-disable-next-line no-unused-vars
  const instance = app.mount(container);
  setTimeout(() => {
    app.unmount();
    document.body.removeChild(container);
  }, 3000);
};
</script>

<style scoped>
i {
    margin-right: 10px;
}
/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 0;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease;
}

.modal-header {
    background: #f39c12;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    color: white;
    font-size: 24px;
    font-weight: 600;
}

.modal-close-btn {
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    color: white;
    transition: transform 0.3s;
}

.modal-close-btn:hover {
    transform: rotate(90deg);
    color: #ecf0f1;
}

.modal-body {
    padding: 25px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: flex;
    align-items: center;
    color: #2c3e50;
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 8px;
}

.form-label i {
    color: #3498db;
}

.form-input {
    width: 90%;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s;
}

.form-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

.form-textarea {
    width: 90%;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 8px;
    font-size: 15px;
    min-height: 100px;
    resize: vertical;
    transition: border-color 0.3s;
}

.form-textarea:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

/* Custom Select with Search */
.select-wrapper {
    position: relative;
}

.search-manager-input {
    width: 90%;
    padding: 12px;
    border: 1px solid #dfe6e9;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s;
}

.search-manager-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
}

.manager-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #dfe6e9;
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.manager-option {
    padding: 10px 15px;
    cursor: pointer;
    color: #636e72;
    font-size: 14px;
    transition: background 0.3s;
}

.manager-option:hover {
    background: #f8f9fa;
}

.no-results {
    padding: 10px 15px;
    color: #7f8c8d;
    font-size: 14px;
    text-align: center;
}

/* Modal Footer */
.modal-footer {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 20px;
}

.cancel-btn {
    background: #ecf0f1;
    color: #2c3e50;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.cancel-btn:hover {
    background: #dfe6e9;
}

.save-btn {
    background: #27ae60;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.3s;
}

.save-btn:hover {
    background: #219653;
}

@keyframes slideIn {
    from {
    transform: translateY(-50px);
    opacity: 0;
    }
    to {
    transform: translateY(0);
    opacity: 1;
    }
}
</style>
