<template>
    <div class="container">
    <Navbar />
    <div class="main-content">
        <!-- Header -->
        <div class="header">
        <h1 class="title">Thêm sản phẩm mới</h1>
        <router-link to="/product-management" class="back-btn">
            <i class="fas fa-arrow-left mr-2"></i> Quay lại
        </router-link>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitProduct" class="form-container">
        <div class="form-grid">
            <!-- Thông tin cơ bản -->
            <div class="form-section">
            <h3>Thông tin cơ bản</h3>
            <div class="form-group">
                <label>Tên sản phẩm</label>
                <input v-model="product.productName" type="text" placeholder="Nhập tên sản phẩm" required />
            </div>
            <div class="form-group">
                <label>Giá (VNĐ)</label>
                <input v-model.number="product.price" type="number" min="0" placeholder="Nhập giá" required />
            </div>
            <div class="form-group">
                <label>Số lượng</label>
                <input v-model.number="product.stockQuantity" type="number" min="0" placeholder="Nhập số lượng" required />
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
                <select v-model="product.brandId" required>
                <option :value="null" disabled>Chọn thương hiệu</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Chọn danh mục</label>
                <select v-model="product.categoryId" required>
                <option :value="null" disabled>Chọn danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Chọn nhà cung cấp</label>
                <select v-model="product.supplierId" required>
                <option :value="null" disabled>Chọn nhà cung cấp</option>
                <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">{{ sup.name }}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Chọn kho hàng</label>
                <select v-if="userRole.code === 'admin'" v-model="product.warehouseId" required>
                    <option :value="null" disabled>Chọn kho hàng</option>
                    <option v-for="wh in warehouses" :key="wh.id" :value="wh.id">{{ wh.name }}</option>
                </select>
                <select v-else v-model="product.warehouseId" disabled required>
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
                <label>Chọn hình ảnh</label>
                <input type="file" @change="handleFileChange" accept="image/*" />
                <div v-if="selectedFile" class="image-preview">
                <img :src="previewUrl" alt="Preview" class="preview-image" />
                </div>
            </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
            <button type="submit" class="submit-btn">
            <i class="fas fa-plus mr-2"></i> Thêm sản phẩm
            </button>
        </div>
        </form>
    </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Navbar from '@/components/NavbarComponent.vue';
import { useRouter } from 'vue-router';
import { addProductApi, getForAddApi } from '@/services/modules/product.api';
import { uploadNormalApi } from '@/services/modules/upload.api';

const router = useRouter();
const dataUser = JSON.parse(localStorage.getItem('user'))
const userRole = JSON.parse(localStorage.getItem('roles'));
const warehouseUser = dataUser.warehouses[0]
// product.value.warehouseId = warehouseUser.id

const product = ref({
    productName: '',
    price: 0,
    stockQuantity: 0,
    size: '',
    color: '',
    material: '',
    discount: 0,
    brandId: null,
    categoryId: null,
    supplierId: null,
    warehouseId: userRole.code === 'admin' ? null : warehouseUser.id,
    description: '',
    imageUrl: '',
    discountType: '' || 'fixed',
});


const brands = ref([]);
const categories = ref([]);
const suppliers = ref([]);
const warehouses = ref([]);
const selectedFile = ref(null);
const discountType = ref('fixed');
const previewUrl = ref('');

onMounted(async () => {
    try {
        const response = await getForAddApi();
        const data = response.data.data;
        brands.value = data.brands;
        categories.value = data.categories;
        suppliers.value = data.suppliers;
        warehouses.value = data.warehouses;
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0];
    if (selectedFile.value) {
    previewUrl.value = URL.createObjectURL(selectedFile.value);
    }
};

const handleImageUpload = async () => {
    if (!selectedFile.value) {
        alert('Vui lòng chọn một tệp hình ảnh!');
        return null;
    }

    const formData = new FormData();
    formData.append('file', selectedFile.value);

    try {
        const response = await uploadNormalApi(formData);
        return response.data.data[0]?.url || null;
    } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        alert('Lỗi khi tải ảnh lên, vui lòng thử lại!');
        return null;
    }
};

const submitProduct = async () => {
    try {
        const uploadedImageUrl = await handleImageUpload();
        if (!uploadedImageUrl) return;

        product.value.imageUrl = uploadedImageUrl;

        await addProductApi(product.value);
        alert('Thêm sản phẩm thành công!');
        router.push('/product-management');
    } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    alert('Có lỗi xảy ra, vui lòng thử lại!');
    }
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