<template>
    <div class="container">
    <Navbar />
    <div class="main-content">
        <!-- Header -->
        <div class="header">
        <h2 class="title">Tạo phiếu nhập kho</h2>
        <router-link to="/enter-management" class="back-btn">
            <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitRoom" class="form-container">
        <div class="form-group">
            <label class="form-label">
                <i class="fas fa-user mr-2" style="margin-right: 10px;"></i> Người tạo hóa đơn
            </label>
            <input
                type="text"
                v-model="dataUser.name"
                class="form-input"
                placeholder=""
                required
                disabled
            />
        </div>

        <div class="form-group filters" >
            <div class="filter-item" style="margin-right: 10px;">
                <label>Kho hàng</label>
                <select class="form-input"  v-if="userRole.code === 'admin'" v-model="detailsEnterWarehouse.idWarehouse" required>
                    <option :value="null" disabled>Chọn kho hàng</option>
                    <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
                </select>
                <input v-else
                    type="text"
                    class="form-input"
                    :value="warehouseName"
                    disabled
                />
            </div>
            <div class="filter-item">
                <label>Nhà cung cấp</label>
                <select v-model="detailsEnterWarehouse.idSupplier" class="form-input" required>
                    <option :value="null" disabled>Chọn nhà cung cấp</option>
                    <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
                </select>
            </div>
            <div class="filter-item checkbox">
            <label>
                <input type="checkbox" v-model="detailsEnterWarehouse.isReturn" />
                Hoàn hàng
            </label>
            </div>
        </div>

        <!-- Add Product Section -->
        <div class="form-group product-add-section">
            <h3>Thêm hàng hóa</h3>
            <div class="product-inputs">
            <div class="filter-item">
                <label>Sản phẩm</label>
                <select v-model="newProduct.id" class="form-input">
                <option :value="null" disabled>Chọn sản phẩm</option>
                <option v-for="product in listBasicProduct" :key="product.id" :value="product.id">
                    {{ product.product_name }}
                </option>
                </select>
            </div>
            <div class="filter-item">
                <label>Số lượng</label>
                <input
                    type="number"
                    v-model.number="newProduct.quantity"
                    class="form-input"
                    placeholder="Số lượng"
                />
                    <!-- min="1" -->
            </div>
            <div class="filter-item">
                <label>Giá nhập (VNĐ)</label>
                <input
                    type="number"
                    v-model.number="newProduct.price_per_unit"
                    class="form-input"
                    placeholder="Giá nhập"
                    />
                    <!-- min="0" -->
            </div>
            <div class="filter-item">
                <label>Tổng tiền</label>
                <input
                type="text"
                :value="formatCurrency(newProduct.quantity * newProduct.price_per_unit || 0)"
                class="form-input"
                disabled
                />
            </div>
            <button type="button" @click="addProduct" class="add-product-btn">
                <i class="fas fa-plus mr-2"></i> Thêm hàng hóa
            </button>
            </div>
        </div>

        <!-- Product List Table -->
        <div class="product-list" v-if="detailsEnterWarehouse.products.length > 0">
            <h3>Danh sách hàng hóa</h3>
            <table class="product-table">
            <thead>
                <tr>
                <th class="stt">STT</th>
                <th class="product-name">Tên sản phẩm</th>
                <th class="quantity">Số lượng</th>
                <th class="price">Giá nhập (VNĐ)</th>
                <th class="total">Thành tiền (VNĐ)</th>
                <th class="actions">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in detailsEnterWarehouse.products" :key="index">
                <td class="stt">{{ index + 1 }}</td>
                <td class="product-name">
                    {{ listBasicProduct.find(p => p.id === product.id)?.product_name || 'N/A' }}
                </td>
                <td class="quantity">{{ product.quantity }}</td>
                <td class="price">{{ formatCurrency(product.price_per_unit) }}</td>
                <td class="total">{{ formatCurrency(product.total = product.quantity * product.price_per_unit) }}</td>
                <td class="actions">
                    <button @click="removeProduct(index)" class="delete-btn">
                    <i class="fas fa-trash"></i>
                    </button>
                </td>
                </tr>
            </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals">
            <p><strong>Tổng số lượng hàng hóa:</strong> {{ totalQuantity }}</p>
            <p><strong>Tổng giá trị hàng hóa:</strong> {{ formatCurrency(totalPrice) }} VNĐ</p>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">
            <i class="fas fa-plus mr-2" style="margin-right: 10px;"></i> Tạo hóa đơn nhập kho
        </button>
        </form>
    </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import { getListProductApi, getForAddApi } from '@/services/modules/product.api';
import { createEnterWarehouseApi } from '@/services/modules/enter-warehouse.api';
import { useRouter } from 'vue-router';

const router = useRouter();
const dataUser = JSON.parse(localStorage.getItem('user'));
const warehouseUser = dataUser.warehouses[0]
const userRole = JSON.parse(localStorage.getItem('roles'));


const detailsEnterWarehouse = ref({
    idUser: null,
    idSupplier: null,
    idWarehouse: userRole.code === 'admin' ? null : warehouseUser.id,
    total_product: 0,
    total_price: 0,
    products: [],
    isReturn: false,
});

const suppliers = ref([]);
const warehouses = ref([]);
const listBasicProduct = ref([]);

const newProduct = ref({
    id: null,
    quantity: 1,
    price_per_unit: 0,
    total: 0,
});

onMounted(async () => {
    detailsEnterWarehouse.value.idUser = dataUser.id;
    await fetchFilterData();
    await fetchListBasicProduct();
});

const fetchFilterData = async () => {
    try {
        const response = await getForAddApi();
        const data = response.data.data;
        suppliers.value = data.suppliers;
        warehouses.value = data.warehouses;
    } catch (error) {
    console.error('Error fetching filter data:', error);
    }
};

const fetchListBasicProduct = async () => {
    try {
    const response = await getListProductApi();
    listBasicProduct.value = response.data.data; // Giả sử API trả về dữ liệu trong response.data.data
    } catch (error) {
    console.error('Error fetching product data:', error);
    }
};

const addProduct = () => {
    if (!newProduct.value.id || newProduct.value.quantity <= 0 || newProduct.value.price_per_unit < 0) {
    alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
    return;
    }
    detailsEnterWarehouse.value.products.push({ ...newProduct.value });
    resetNewProduct();
};

const removeProduct = (index) => {
    detailsEnterWarehouse.value.products.splice(index, 1);
};

const resetNewProduct = () => {
    newProduct.value = { id: null, quantity: 0, price_per_unit: 0 };
};

const totalQuantity = computed(() => {
    return detailsEnterWarehouse.value.products.reduce((sum, p) => sum + p.quantity, 0);
});

const totalPrice = computed(() => {
    return detailsEnterWarehouse.value.products.reduce((sum, p) => sum + p.quantity * p.price_per_unit, 0);
});

const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN').format(parseFloat(value));
};

const submitRoom = async () => {
    if (detailsEnterWarehouse.value.isReturn) {
        // if (!confirm('Bạn có chắc chắn muốn hoàn hàng?')) {
            if (!detailsEnterWarehouse.value.idWarehouse) {
                alert('Vui lòng chọn kho hàng và nhà cung cấp!');
                return;
            }
        // }
    } else {
        if (!detailsEnterWarehouse.value.idWarehouse || !detailsEnterWarehouse.value.idSupplier) {
            alert('Vui lòng chọn kho hàng và nhà cung cấp!');
            return;
        }
    }
    if (detailsEnterWarehouse.value.products.length === 0) {
        alert('Vui lòng thêm ít nhất một sản phẩm!');
        return;
    }

    try {
        const payload = {
            idUser: detailsEnterWarehouse.value.idUser,
            idSupplier: detailsEnterWarehouse.value.idSupplier,
            idWarehouse: detailsEnterWarehouse.value.idWarehouse,
            total_product: totalQuantity.value,
            total_price: totalPrice.value,
            products: detailsEnterWarehouse.value.products,
            isReturn: detailsEnterWarehouse.value.isReturn,
        };
        await createEnterWarehouseApi(payload);
        alert('Phiếu nhập kho đã được tạo thành công!');
        router.push('/enter-management');
    } catch (error) {
        console.error('Lỗi khi tạo phiếu nhập kho:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
};
const warehouseName = computed(() => {
  const warehouse = warehouses.value.find(w => w.id === detailsEnterWarehouse.value.idWarehouse);
  return warehouse ? warehouse.name : 'Không xác định';
});

</script>

<style scoped>

.container {
    min-height: 100vh;
    background: #f4f6f9;
    display: flex;
}

.main-content {
    margin-left: 280px;
    width: calc(100% - 280px);
    padding: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #28a745, #218838);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.title {
    font-size: 1.75rem;
    color: #fff;
    font-weight: 700;
    margin: 0;
}

.back-btn {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.form-container {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    font-size: 1rem;
    color: #555;
    font-weight: 500;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.form-input {
    width: 100%;
    width: auto;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    border-color: #28a745;
    outline: none;
}

.form-input:disabled {
    background: #f8f9fa;
    color: #6c757d;
}

.filters {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 200px;
}

.filter-item.checkbox {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
}

.product-add-section h3,
.product-list h3 {
    font-size: 1.25rem;
    color: #343a40;
    font-weight: 600;
    margin-bottom: 1rem;
}

.product-inputs {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: flex-end;
}

.add-product-btn {
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-product-btn:hover {
    background: #0056b3;
}

.product-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
}

.product-table th,
.product-table td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #e9ecef;
}

.product-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #343a40;
    font-size: 0.95rem;
    text-transform: uppercase;
}

.product-table td {
    color: #495057;
    font-size: 0.9rem;
}

.product-table tr:hover {
    background: #f1f3f5;
}

.stt { width: 5%; }
.product-name { width: 35%; text-align: left; }
.quantity { width: 15%; }
.price { width: 20%; }
.total { width: 20%; }
.actions { width: 10%; }

.delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.delete-btn:hover {
    background: #c82333;
}

.totals {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 1.5rem;
}

.totals p {
    font-size: 1.1rem;
    color: #343a40;
}

.totals p strong {
    font-weight: 600;
    color: #28a745;
}

.submit-btn {
    padding: 0.75rem 1.5rem;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    background: #218838;
}
</style>