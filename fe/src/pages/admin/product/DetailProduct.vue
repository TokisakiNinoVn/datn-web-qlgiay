<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Chi tiết sản phẩm</h1>
        <router-link to="/product-management" class="back-btn">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại danh sách
        </router-link>
      </div>

      <!-- Product Details -->
      <div class="details-container" v-if="product">
        <div class="details-layout">
          <!-- Left Column: Image and Main Info -->
          <div class="left-column">
            <div class="image-card">
              <img
                :src="instance.defaults.baseURL + product.image_url"
                alt="Product Image"
                class="product-image"
                @click="showFullImage(product.image_url)"
                v-if="product.image_url"
              />
              <div class="no-image" v-else>Không có hình ảnh</div>
            </div>
            <div class="main-info-card">
              <h2 class="product-name">{{ product.product_name }}</h2>
              <div class="price-tag">
                <span class="label">Giá:</span>
                <span class="value">{{ formatCurrency(product.price) }} VNĐ</span>
              </div>
              <div class="stock-tag">
                <span class="label">Số lượng:</span>
                <span class="value">{{ product.stock_quantity }}</span>
              </div>
              <div class="discount-tag" v-if="product.discount">
                <span class="label">Giảm giá:</span>
                <span class="value">{{ formatDiscount(product.discount) }}</span>
              </div>
              <div class="description">
                <span class="label">Mô tả:</span>
                <p class="value">{{ product.description || 'Không có mô tả' }}</p>
              </div>
            </div>
          </div>

          <!-- Right Column: Additional Info -->
          <div class="right-column">
            <div class="info-card">
              <h3>Thông tin bổ sung</h3>
              <div class="info-table">
                <div class="info-row">
                  <span class="label">Thương hiệu:</span>
                  <span class="value">{{ getBrandName(product.brand_id) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Danh mục:</span>
                  <span class="value">{{ getCategoryName(product.category_id) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Nhà cung cấp:</span>
                  <span class="value">{{ getSupplierName(product.supplier_id) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Kho hàng:</span>
                  <span class="value">{{ getWarehouseName(product.warehouse_id) }}</span>
                </div>
              </div>
            </div>
            <div class="info-card">
              <h3>Đặc điểm sản phẩm</h3>
              <div class="info-table">
                <div class="info-row">
                  <span class="label">Chất liệu:</span>
                  <span class="value">{{ product.material }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Size:</span>
                  <span class="value">{{ product.size }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Màu sắc:</span>
                  <span class="value">{{ product.color }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!product" class="loading">
        <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...
      </div>

      <!-- Full Image Modal -->
      <div v-if="showImageModal" class="image-modal">
        <div class="image-modal-content">
          <img :src="fullImageUrl" alt="Full Product Image" class="full-image" />
          <button @click="closeFullImage" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/NavbarComponent.vue';
import { getDetailsProductByIdApi } from '@/services/modules/product.api';
import { getForAddApi } from '@/services/modules/product.api';
import instance from '@/services/axiosConfig';

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

const product = ref(null);
const brands = ref([]);
const categories = ref([]);
const suppliers = ref([]);
const warehouses = ref([]);
const showImageModal = ref(false);
const fullImageUrl = ref('');

onMounted(async () => {
  await fetchProductDetails();
  await fetchFilterData();
});

const fetchProductDetails = async () => {
  try {
    const response = await getDetailsProductByIdApi(productId);
    product.value = response.data.data; // Giả sử API trả về dữ liệu trong response.data.data
  } catch (error) {
    console.error('Error fetching product details:', error);
    alert('Không thể tải thông tin sản phẩm!');
    router.push('/product-management');
  }
};

const fetchFilterData = async () => {
  try {
    const response = await getForAddApi();
    const data = response.data.data;
    brands.value = data.brands;
    categories.value = data.categories;
    suppliers.value = data.suppliers;
    warehouses.value = data.warehouses;
  } catch (error) {
    console.error('Error fetching filter data:', error);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(parseFloat(value));
};

const formatDiscount = (discount) => {
  if (!discount) return 'Không có giảm giá';
  return discount <= 100 ? `${discount}%` : formatCurrency(discount) + ' VNĐ';
};

const getBrandName = (brandId) => {
  const brand = brands.value.find(b => b.id === brandId);
  return brand ? brand.name : 'Không xác định';
};

const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Không xác định';
};

const getSupplierName = (supplierId) => {
  const supplier = suppliers.value.find(s => s.id === supplierId);
  return supplier ? supplier.name : 'Không xác định';
};

const getWarehouseName = (warehouseId) => {
  const warehouse = warehouses.value.find(w => w.id === warehouseId);
  return warehouse ? warehouse.name : 'Không xác định';
};

const showFullImage = (imageUrl) => {
  fullImageUrl.value = instance.defaults.baseURL + imageUrl;
  showImageModal.value = true;
};

const closeFullImage = () => {
  showImageModal.value = false;
  fullImageUrl.value = '';
};
</script>

<style scoped>
i {
  margin-right: 8px;
}
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
  background: linear-gradient(135deg, #007bff, #0056b3);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
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
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.details-container {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.details-layout {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.left-column {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-column {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.image-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.product-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.05);
}

.no-image {
  font-size: 1rem;
  color: #6c757d;
  padding: 2rem;
}

.main-info-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-name {
  font-size: 1.75rem;
  color: #343a40;
  font-weight: 700;
  margin-bottom: 1rem;
}

.price-tag,
.stock-tag,
.discount-tag,
.description {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price-tag .value {
  font-size: 1.5rem;
  color: #28a745;
  font-weight: 600;
}

.stock-tag .value {
  font-size: 1.25rem;
  color: #007bff;
}

.discount-tag .value {
  font-size: 1.25rem;
  color: #dc3545;
}

.description .label {
  font-weight: 500;
  color: #555;
}

.description .value {
  font-size: 1rem;
  color: #495057;
  line-height: 1.5;
}

.info-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.info-card h3 {
  font-size: 1.25rem;
  color: #343a40;
  font-weight: 600;
  margin-bottom: 1rem;
}

.info-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.info-row .value {
  font-size: 0.9rem;
  color: #495057;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
}

/* Image Modal */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.full-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -40px;
  padding: 0.75rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #c82333;
}
</style>