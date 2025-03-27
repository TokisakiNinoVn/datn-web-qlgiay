<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Chỉnh sửa sản phẩm</h1>
        <router-link to="/product-management" class="back-btn">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </router-link>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitProduct" class="form-container" v-if="product">
        <div class="form-grid">
          <!-- Thông tin cơ bản -->
          <div class="form-section">
            <h3>Thông tin cơ bản</h3>
            <div class="form-group">
              <label>Tên sản phẩm</label>
              <input v-model="product.product_name" type="text" placeholder="Nhập tên sản phẩm" required />
            </div>
            <div class="form-group">
              <label>Giá (VNĐ)</label>
              <input v-model.number="product.price" type="number" min="0" placeholder="Nhập giá" required />
            </div>
            <div class="form-group">
              <label>Số lượng</label>
              <input v-model.number="product.stock_quantity" type="number" min="0" placeholder="Nhập số lượng" required />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="product.description" placeholder="Nhập mô tả sản phẩm" rows="4"></textarea>
            </div>
          </div>

          <!-- Thông tin bổ sung -->
          <div class="form-section">
            <h3>Thông tin bổ sung</h3>
            <div class="form-group">
              <label>Chọn thương hiệu</label>
              <select v-model="product.brand_id" required>
                <option :value="null" disabled>Chọn thương hiệu</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Chọn danh mục</label>
              <select v-model="product.category_id" required>
                <option :value="null" disabled>Chọn danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Chọn nhà cung cấp</label>
              <select v-model="product.supplier_id" required>
                <option :value="null" disabled>Chọn nhà cung cấp</option>
                <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Chọn kho hàng</label>
              <select v-model="product.warehouse_id" required>
                <option :value="null" disabled>Chọn kho hàng</option>
                <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
              </select>
            </div>
          </div>

          <!-- Đặc điểm sản phẩm -->
          <div class="form-section">
            <h3>Đặc điểm sản phẩm</h3>
            <div class="form-group">
              <label>Chất liệu</label>
              <input v-model="product.material" type="text" placeholder="Nhập chất liệu" required />
            </div>
            <div class="form-group">
              <label>Size</label>
              <input v-model="product.size" type="text" placeholder="Nhập kích thước" required />
            </div>
            <div class="form-group">
              <label>Màu sắc</label>
              <input v-model="product.color" type="text" placeholder="Nhập màu sắc" required />
            </div>
            <div class="form-group discount-group">
              <label>Giảm giá</label>
              <div class="discount-options">
                <label>
                  <input type="radio" value="fixed" v-model="discountType" />
                  Số tiền cố định
                </label>
                <label>
                  <input type="radio" value="percentage" v-model="discountType" />
                  Phần trăm (%)
                </label>
              </div>
              <input
                v-model.number="product.discount"
                type="number"
                :min="discountType === 'percentage' ? 0 : undefined"
                :max="discountType === 'percentage' ? 100 : undefined"
                :placeholder="discountType === 'percentage' ? 'Nhập phần trăm' : 'Nhập số tiền'"
              />
            </div>
          </div>

          <!-- Hình ảnh -->
          <div class="form-section image-section">
            <h3>Hình ảnh sản phẩm</h3>
            <div class="form-group">
              <label>Hình ảnh hiện tại</label>
              <div v-if="product.image_url" class="image-preview">
                <img :src="instance.defaults.baseURL + product.image_url" alt="Current Image" class="preview-image" />
              </div>
              <label>Thay đổi hình ảnh</label>
              <input type="file" @change="handleFileChange" accept="image/*" />
              <div v-if="selectedFile" class="image-preview">
                <img :src="previewUrl" alt="New Preview" class="preview-image" />
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="submit-btn">
            <i class="fas fa-save mr-2"></i> Cập nhật sản phẩm
          </button>
        </div>
      </form>

      <!-- Loading State -->
      <div v-if="!product" class="loading">
        <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, createApp } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/NavbarComponent.vue';
import { getDetailsProductByIdApi } from '@/services/modules/product.api';
import { getForAddApi } from '@/services/modules/product.api';
import { uploadNormalApi } from '@/services/modules/upload.api';
import instance from '@/services/axiosConfig';
import NotificationComponent from '@/components/NotificationComponent.vue';

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

const product = ref(null);
const brands = ref([]);
const categories = ref([]);
const suppliers = ref([]);
const warehouses = ref([]);
const selectedFile = ref(null);
const previewUrl = ref('');
const discountType = ref('fixed');

onMounted(async () => {
  await fetchProductDetails();
  await fetchFilterData();
});

const fetchProductDetails = async () => {
  try {
    const response = await getDetailsProductByIdApi(productId);
    product.value = response.data.data; // Giả sử API trả về dữ liệu trong response.data.data
    console.log(response.data.data);
    discountType.value = product.value.discount > 0 && product.value.discount <= 100 ? 'percentage' : 'fixed';
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

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    previewUrl.value = URL.createObjectURL(selectedFile.value);
  }
};

const handleImageUpload = async () => {
  if (!selectedFile.value) return product.value.imageUrl; // Giữ ảnh cũ nếu không thay đổi

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await uploadNormalApi(formData);
    return response.data.data[0]?.url || product.value.imageUrl;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    alert('Lỗi khi tải ảnh lên, vui lòng thử lại!');
    return product.value.imageUrl;
  }
};

const updateProductApi = async (data) => {
  return instance.put(`/api/private/product`, data);
};

const submitProduct = async () => {
  try {
    // Kiểm tra nếu không có productId hoặc dữ liệu sản phẩm không hợp lệ
    if (!productId || !product.value.product_name?.trim()) {
      showNotification("Vui lòng nhập đầy đủ thông tin sản phẩm!", "error");
      return;
    }

    // Upload hình ảnh nếu có thay đổi
    let uploadedImageUrl = product.value.image_url;
    if (product.value.newImage) {
      uploadedImageUrl = await handleImageUpload();
      if (!uploadedImageUrl) {
        showNotification("Tải ảnh thất bại! Vui lòng thử lại.", "error");
        return;
      }
    }

    const updatedProduct = {
      id: productId,
      warehouseId: product.value.warehouse_id,
      supplierId: product.value.supplier_id,
      categoryId: product.value.category_id,
      brandId: product.value.brand_id,
      productName: product.value.product_name?.trim(),
      price: Number(product.value.price) || 0, // Chuyển đổi sang số, tránh lỗi nhập sai kiểu dữ liệu
      stockQuantity: Number(product.value.stock_quantity) || 0,
      size: product.value.size?.trim() || null,
      color: product.value.color?.trim() || null,
      description: product.value.description?.trim() || null,
      material: product.value.material?.trim() || null,
      discount: Number(product.value.discount) || 0,
      imageUrl: uploadedImageUrl,
      discountType: discountType.value || "fixed",
    };

    // Gọi API cập nhật sản phẩm
    const response = await updateProductApi(updatedProduct);

    if (response.data.code === 200) {
      showNotification("Cập nhật sản phẩm thành công!", "success");
      router.push("/product-management");
    } else {
      showNotification("Cập nhật sản phẩm không thành công!", "error");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    const errorMessage = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!";
    showNotification(`Lỗi: ${errorMessage}`, "error");
  }
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
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  color: #1a1a1a;
  font-weight: 700;
  margin: 0;
}

.back-btn {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
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
  background: #5a6268;
}

.form-container {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section h3 {
  font-size: 1.25rem;
  color: #343a40;
  font-weight: 600;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #fff;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.discount-group .discount-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.discount-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.image-section .image-preview {
  margin-top: 1rem;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #007bff;
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
  background: #0056b3;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
}
</style>