<template>
    <div class="container">
      <Navbar />
      <div class="main-content">
        <div class="header">
          <h2 class="title">Tạo phiếu xuất kho</h2>
          <router-link to="/export-management" class="back-btn">
            <i class="fas fa-arrow-left mr-2" style="margin-right: 10px;"></i> Quay lại
          </router-link>
        </div>
  
        <form @submit.prevent="submitExport" class="form-container">
          <div class="form-group" style="display: flex; flex-direction: column;">
            <label class="form-label">
              <i class="fas fa-user mr-2" style="margin-right: 10px;"></i> Người tạo hóa đơn
            </label>
            <input
              type="text"
              v-model="dataUser.name"
              class="form-input"
              style="max-width: 300px;"
              required
              disabled
            />
          </div>
  
          <div class="form-group filters">
            <div class="filter-item" style="margin-right: 10px;">
                <label>Kho hàng</label>
                <!-- <input
                  type="text"
                  class="form-input"
                  :value="warehouseName"
                  disabled
                /> -->
                <select class="form-input"  v-if="userRole.code === 'admin'" v-model="detailsExportWarehouse.idWarehouse" required>
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
              <label>Tên khách hàng</label>
              <input
                type="text"
                v-model="detailsExportWarehouse.customer_name"
                class="form-input"
                placeholder="Nhập tên khách hàng"
                required
              />
            </div>
            <div class="filter-item">
              <label>Số điện thoại khách hàng</label>
              <input
                type="text"
                v-model="detailsExportWarehouse.customer_phone"
                class="form-input"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>
  
          <div class="form-group product-add-section" v-if="detailsExportWarehouse.idWarehouse">
            <h3>Thêm hàng hóa</h3>
            <div class="product-inputs">
              <div class="filter-item">
                <label>Sản phẩm</label>
                <select v-model="newProduct.id" @change="updateStockAndPrice" class="form-input">
                  <option :value="null" disabled>Chọn sản phẩm</option>
                  <option v-for="product in filteredProducts" :key="product.id" :value="product.id">
                    {{ product.product_name }}
                    <!-- {{ product.product_name }} - {{ formatCurrency(product.price) }} VNĐ - SL: {{ product.stock_quantity }} -->
                  </option>
                </select>
              </div>
              <div class="filter-item">
                <label>Số lượng hàng có sẵn</label>
                <input
                  type="number"
                  :value="newProduct.stock_quantity || 0"
                  class="form-input"
                  disabled
                />
              </div>
              <div class="filter-item">
                <label>Số lượng xuất</label>
                <input
                  type="number"
                  v-model.number="newProduct.quantity"
                  class="form-input"
                  :max="newProduct.stock_quantity"
                  min="1"
                  placeholder="Số lượng"
                  :disabled="!newProduct.id"
                />
              </div>
              <div class="filter-item">
                <label>Giá xuất (VNĐ)</label>
                <input
                  type="text"
                  :value="formatCurrency(newProduct.price_per_unit)"
                  class="form-input"
                  disabled
                />
              </div>
              <div class="filter-item">
                <label>Tổng tiền</label>
                <input
                  type="text"
                  :value="formatCurrency(newProduct.total = newProduct.quantity * newProduct.price_per_unit || 0)"
                  class="form-input"
                  disabled
                />
              </div>
              <button type="button" @click="addProduct" class="add-product-btn" :disabled="!newProduct.id">
                <i class="fas fa-plus mr-2"></i> Thêm hàng hóa
              </button>
            </div>
          </div>
  
          <div class="product-list" v-if="detailsExportWarehouse.products.length > 0">
            <h3>Danh sách hàng hóa</h3>
            <table class="product-table">
              <thead>
                <tr>
                  <th class="stt">STT</th>
                  <th class="product-name">Tên sản phẩm</th>
                  <th class="quantity">Số lượng</th>
                  <th class="price">Giá xuất (VNĐ)</th>
                  <th class="total">Thành tiền (VNĐ)</th>
                  <th class="actions">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in detailsExportWarehouse.products" :key="index">
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
  
          <div class="totals">
            <p><strong>Tổng số lượng hàng hóa:</strong> {{ totalQuantity }}</p>
            <p><strong>Tổng giá trị hàng hóa:</strong> {{ formatCurrency(totalPrice) }} VNĐ</p>
          </div>
  
          <button type="submit" class="submit-btn">
            <i class="fas fa-plus mr-2" style="margin-right: 10px;"></i> Tạo hóa đơn xuất kho
          </button>
        </form>
      </div>
    </div>
  </template>
  
<script setup>
import { onMounted, ref, computed, createApp } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import { getListProductApi, getForAddApi } from '@/services/modules/product.api';
import { createExportWarehouseApi } from '@/services/modules/export-warehouse.api';
import { useRouter } from 'vue-router';
import NotificationComponent from '@/components/NotificationComponent.vue';

const router = useRouter();
  // const dataUser = ref(JSON.parse(localStorage.getItem('user')) || { name: '' });
const dataUser = JSON.parse(localStorage.getItem('user'));
const warehouseUser = dataUser.warehouses[0]
const userRole = JSON.parse(localStorage.getItem('roles'));

  
const detailsExportWarehouse = ref({
  idUser: null,
  // idWarehouse:  warehouseUser.id,
  idWarehouse: userRole.code === 'admin' ? null : warehouseUser.id,
  total_product: 0,
  total_price: 0,
  products: [],
  customer_name: '',
  customer_phone: '',
});

const warehouses = ref([]);
const listBasicProduct = ref([]);

const newProduct = ref({
  id: null,
  quantity: 1,
  price_per_unit: 0,
  stock_quantity: 0,
  total: 0,
});

onMounted(async () => {
  detailsExportWarehouse.value.idUser = dataUser.id;
  await fetchFilterData();
  await fetchListBasicProduct();
});

const fetchFilterData = async () => {
  try {
    const response = await getForAddApi();
    const data = response.data.data;
    warehouses.value = data.warehouses;
  } catch (error) {
    console.error('Error fetching filter data:', error);
  }
};

const fetchListBasicProduct = async () => {
  try {
    const response = await getListProductApi();
    listBasicProduct.value = response.data.data;
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
};

const filteredProducts = computed(() => {
  if (!detailsExportWarehouse.value.idWarehouse) return [];
  return listBasicProduct.value.filter(product => product.warehouse_id === detailsExportWarehouse.value.idWarehouse);
});

const updateStockAndPrice = () => {
  const selectedProduct = listBasicProduct.value.find(p => p.id === newProduct.value.id);
  if (selectedProduct) {
    newProduct.value.price_per_unit = selectedProduct.price || 0;
    newProduct.value.stock_quantity = selectedProduct.stock_quantity || 0;
    newProduct.value.quantity = Math.min(newProduct.value.quantity, newProduct.value.stock_quantity);
  //   newProduct.value.total = Math.min(newProduct.value.quantity, newProduct.value.stock_quantity);
    newProduct.value.total = newProduct.value.quantity * newProduct.value.stock_quantity
  } else {
      newProduct.value.price_per_unit = 0;
      newProduct.value.stock_quantity = 0;
      newProduct.value.quantity = 1;
      newProduct.value.total = newProduct.value.quantity * newProduct.value.stock_quantity
  }
};

const addProduct = () => {
  if (!newProduct.value.id) {
    // alert('Vui lòng chọn sản phẩm!');
    showNotification('Vui lòng chọn sản phẩm!', 'error');
    return;
  }
  if (newProduct.value.quantity <= 0 || newProduct.value.quantity > newProduct.value.stock_quantity) {
    // alert(`Số lượng xuất không hợp lệ! Số lượng phải từ 1 đến ${newProduct.value.stock_quantity}.`);
    showNotification(`Số lượng xuất không hợp lệ! Số lượng phải từ 1 đến ${newProduct.value.stock_quantity}.`, 'error');
    return;
  }
  detailsExportWarehouse.value.products.push({ ...newProduct.value });
  resetNewProduct();
};

const removeProduct = (index) => {
  detailsExportWarehouse.value.products.splice(index, 1);
};

const resetNewProduct = () => {
  newProduct.value = { id: null, quantity: 1, price_per_unit: 0, stock_quantity: 0 };
};

const totalQuantity = computed(() => {
  return detailsExportWarehouse.value.products.reduce((sum, p) => sum + p.quantity, 0);
});

const totalPrice = computed(() => {
  return detailsExportWarehouse.value.products.reduce((sum, p) => sum + p.quantity * p.price_per_unit, 0);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(parseFloat(value));
};

const submitExport = async () => {
  if (!detailsExportWarehouse.value.idWarehouse || !detailsExportWarehouse.value.customer_name || !detailsExportWarehouse.value.customer_phone) {
    // alert('Vui lòng nhập đầy đủ thông tin kho hàng và khách hàng!');
    showNotification('Vui lòng nhập đầy đủ thông tin kho hàng và khách hàng!', 'error');
    return;
  }
  if (detailsExportWarehouse.value.products.length === 0) {
    showNotification('Vui lòng thêm ít nhất một sản phẩm!', 'error');
    // alert('Vui lòng thêm ít nhất một sản phẩm!');
    return;
  }

  try {
    const payload = {
      idUser: detailsExportWarehouse.value.idUser,
      idWarehouse: detailsExportWarehouse.value.idWarehouse,
      total_product: totalQuantity.value,
      total_price: totalPrice.value,
      products: detailsExportWarehouse.value.products.map(p => ({
        id: p.id,
        quantity: p.quantity,
        price_per_unit: p.price_per_unit,
        total: p.total,
      })),
      customer_name: detailsExportWarehouse.value.customer_name,
      customer_phone: detailsExportWarehouse.value.customer_phone,
    };

    const response = await createExportWarehouseApi(payload);
  if (response.data.code !== 201) {
    showNotification('Tạo phiếu xuất kho không thành công!', 'error');
  } else {
    showNotification('Tạo phiếu xuất kho thành công!', 'success');
  }
    // alert('Phiếu xuất kho đã được tạo thành công!');
    router.push('/export-management');
  } catch (error) {
    console.error('Lỗi khi tạo phiếu xuất kho:', error);
    // alert('Có lỗi xảy ra, vui lòng thử lại!');
    showNotification(`Lỗi khi tạo phiếu xuất kho: ${error}`, 'error');
  }
};

const warehouseName = computed(() => {
  const warehouse = warehouses.value.find(w => w.id === detailsExportWarehouse.value.idWarehouse);
  return warehouse ? warehouse.name : 'Không xác định';
});
const showNotification = (message, type) => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const app = createApp(NotificationComponent, { message, type });

  // eslint-disable-next-line no-unused-vars
  const instance = app.mount(container);
  // Tự động xóa thông báo sau 3 giây
  setTimeout(() => {
    app.unmount();
    document.body.removeChild(container);
  }, 3000);
};
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
  background: linear-gradient(135deg, #dc3545, #c82333);
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
  width: 80%;
  /* width: auto; */
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #dc3545;
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

.add-product-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
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
  color: #dc3545;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #dc3545;
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
  background: #c82333;
}
</style>