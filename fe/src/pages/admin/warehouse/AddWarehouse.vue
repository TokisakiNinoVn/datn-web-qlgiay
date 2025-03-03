<template>
    <div class="container">
        <Navbar />
        <div class="main-content">
            <div class="header">
                <h2 class="title">Thêm kho hàng</h2>
                <router-link to="/warehouse-management" class="back-btn">
                    <i class="fas fa-arrow-left mr-2"></i> Quay lại
                </router-link>
            </div>

            <form @submit.prevent="submitRoom" class="form-container">
                <div class="form-group">
                    <label for="name" class="form-label">
                        <i class="fas fa-warehouse mr-2"></i> Tên kho
                    </label>
                    <input
                        type="text"
                        id="name"
                        v-model="warehouse.name"
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
                        v-model="warehouse.address"
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
                        v-model="warehouse.description"
                        class="form-textarea"
                        placeholder="Nhập mô tả kho"
                    ></textarea>
                </div>

                <div class="form-group">
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

                <button type="submit" class="submit-btn">
                    <i class="fas fa-plus mr-2"></i> Thêm kho
                </button>
            </form>
        </div>
    </div>

    <!-- Hộp thoại xác nhận -->
    <transition name="fade">
        <div v-if="confirmDialogVisible" class="modal-overlay">
            <div class="modal">
                <p>Nhân viên được chọn này sẽ được chuyển thành chức Quản lý kho?</p>
                <div class="modal-actions">
                    <button @click="confirmManagerSelection" class="btn-confirm">Đồng ý</button>
                    <button @click="confirmDialogVisible = false" class="btn-cancel">Hủy</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import Navbar from "@/components/NavbarComponent.vue";
import { createWarehouseApi } from "@/services/modules/warehouse.api";
import { getAllUserWithRoleApi } from "@/services/modules/user.api";
import { useRouter } from "vue-router";

const router = useRouter();
const warehouse = ref({
    name: "",
    address: "",
    description: "",
    idManager: null,
    roleCodeUserManager: "" || null,
});

const managers = ref([]);
const managerSearch = ref("");
const showDropdown = ref(false);
const confirmDialogVisible = ref(false);
const selectedManager = ref(null);

onMounted(async () => {
    try {
        const response = await getAllUserWithRoleApi();
        managers.value = response.data.filter(user => user.role_code === "manager" || user.role_code === "staff" || user.role_id === 2 || user.role_id === 3);
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
    if (manager.role_code === "staff") {
        selectedManager.value = manager;
        confirmDialogVisible.value = true;
    } else {
        warehouse.value.idManager = manager.id;
        warehouse.value.roleCodeUserManager = manager.role_code;
        managerSearch.value = manager.full_name;
        showDropdown.value = false;
    }
};

const confirmManagerSelection = () => {
    if (selectedManager.value) {
        warehouse.value.idManager = selectedManager.value.id;
        warehouse.value.roleCodeUserManager = selectedManager.value.role_code;
        managerSearch.value = selectedManager.value.full_name;
    }
    confirmDialogVisible.value = false;
};

const hideDropdownWithDelay = () => {
    setTimeout(() => {
        showDropdown.value = false;
    }, 200);
};

const submitRoom = async () => {
    if (!warehouse.value.idManager) {
        alert("Người quản lý không được để trống!");
        return;
    }
    try {
        const payload = {
            name: warehouse.value.name,
            address: warehouse.value.address,
            description: warehouse.value.description || null,
            idManager: warehouse.value.idManager,
        };
        await createWarehouseApi(payload);
        alert("Kho hàng đã được thêm thành công!");
        router.push("/warehouse-management");
    } catch (error) {
        console.error("Lỗi khi thêm kho:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
};

</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
}
.modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
}
.btn-confirm {
    background: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}
.btn-cancel {
    background: #dc3545;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
/* General Styles */
.container {
    display: flex;
    min-height: 100vh;
    background: #f0f2f5;
}

.main-content {
    flex: 1;
    margin-left: 260px;
    padding: 30px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 15px;
    border-bottom: 1px solid #e8ecef;
    margin-bottom: 25px;
}

.title {
    color: #2c3e50;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.back-btn {
    color: #3498db;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: color 0.3s;
}

.back-btn:hover {
    color: #2980b9;
}

/* Form Styles */
.form-container {
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    width: 100%;
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
    width: 100%;
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
    width: 100%;
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

/* Submit Button */
.submit-btn {
    width: 100%;
    background: #27ae60;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    transition: background 0.3s;
}

.submit-btn:hover {
    background: #219653;
}
</style>