<template>
  <div class="container">
    <Navbar />
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <h1 class="title">Chi tiết hóa đơn nhập kho</h1>
        <router-link to="/enter-management" class="back-btn">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại danh sách
        </router-link>
      </div>

      <!-- Invoice Details -->
      <div class="details-container" v-if="transaction">
        <div class="details-layout">
          <!-- Left Column: Invoice Info -->
          <div class="invoice-info-card">
            <h2 class="invoice-code">Mã hóa đơn: {{ transaction.invoice_code }}</h2>
            <div class="info-item">
              <span class="label">Người tạo:</span>
              <span class="value">{{ transaction.person_created }}</span>
            </div>
            <div class="info-item">
              <span class="label">Nhà cung cấp:</span>
              <span class="value">{{ transaction.supplier_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Kho hàng:</span>
              <span class="value">{{ transaction.warehouse_name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Ngày tạo:</span>
              <span class="value">{{ formatDate(transaction.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Trạng thái:</span>
              <span class="value" :class="getStatusClass(transaction.transaction_status)">
                {{ formatStatus(transaction.transaction_status) }}
              </span>
            </div>
            <div class="info-item total">
              <span class="label">Tổng số sản phẩm:</span>
              <span class="value">{{ transaction.total_product }}</span>
            </div>
            <div class="info-item total">
              <span class="label">Tổng giá trị:</span>
              <span class="value">{{ formatCurrency(transaction.total_price) }} VNĐ</span>
            </div>
          </div>

          <!-- Right Column: Product List -->
          <div class="product-list-card">
            <h3>Danh sách sản phẩm</h3>
            <table class="product-table">
              <thead>
                <tr>
                  <th class="stt">STT</th>
                  <th class="product-name">Tên sản phẩm</th>
                  <th class="quantity">Số lượng</th>
                  <th class="price-per-unit">Giá nhập</th>
                  <th class="total-price">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in transaction.products" :key="product.id">
                  <td class="stt">{{ index + 1 }}</td>
                  <td class="product-name">{{ product.product_name }}</td>
                  <td class="quantity">{{ product.quantity }}</td>
                  <td class="price-per-unit">{{ formatCurrency(product.price_per_unit) }} VNĐ</td>
                  <td class="total-price">{{ formatCurrency(product.total) }} VNĐ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!transaction" class="loading">
        <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải dữ liệu...
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/NavbarComponent.vue';
import { getEnterWarehouseByIdApi } from '@/services/modules/enter-warehouse.api';

const route = useRoute();
const transaction = ref(null);

onMounted(async () => {
  await fetchTransactionDetails();
});

const fetchTransactionDetails = async () => {
  try {
    const response = await getEnterWarehouseByIdApi(route.params.id);
    transaction.value = response.data.transaction; // Giả sử API trả về dữ liệu trong response.data.transaction
  } catch (error) {
    console.error('Error fetching transaction details:', error);
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(parseFloat(value));
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatStatus = (status) => {
  switch (status) {
    case 'pending': return 'Chờ xử lý';
    case 'completed': return 'Hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const getStatusClass = (status) => {
  return {
    'status-pending': status === 'pending',
    'status-completed': status === 'completed',
    'status-cancelled': status === 'cancelled',
  };
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

.invoice-info-card {
  flex: 1;
  min-width: 300px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.invoice-code {
  font-size: 1.75rem;
  color: #343a40;
  font-weight: 700;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.info-item .value {
  font-size: 1rem;
  color: #495057;
}

.info-item.total .label {
  font-weight: 600;
  color: #343a40;
}

.info-item.total .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #28a745;
}

.status-pending {
  color: #ffc107;
  font-weight: 500;
}

.status-completed {
  color: #28a745;
  font-weight: 500;
}

.status-cancelled {
  color: #dc3545;
  font-weight: 500;
}

.product-list-card {
  flex: 2;
  min-width: 400px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.product-list-card h3 {
  font-size: 1.25rem;
  color: #343a40;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
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

.stt { width: 10%; }
.product-name { width: 40%; text-align: left; }
.quantity { width: 15%; }
.price-per-unit { width: 20%; }
.total-price { width: 20%; }

.loading {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.1rem;
}

i {
  /* font-size: 1.5rem; */
  margin-right: 0.5rem;
}
</style>