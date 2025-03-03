<template>
  <div class="container">
    <Navbar />
    <div class="form-container">
      <h2 class="form-title">Tạo đơn hàng mới</h2>
      <form @submit.prevent="submitOrder" class="form">
        
        <div class="form-group">
          <label for="user_id">Người dùng</label>
          <select v-model="order.userId" id="user_id" required class="form-select">
            <option value="" disabled>Chọn người dùng</option>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="shipping_address">Địa chỉ giao hàng</label>
          <textarea id="shipping_address" v-model="order.shippingAddress" required class="form-textarea" rows="4"></textarea>
        </div>

        <div class="form-group">
          <label for="to_person">Người nhận</label>
          <input type="text" id="to_person" v-model="order.toPerson" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="phone">SDT:</label>
          <input type="number" id="phone" v-model="order.phone" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="total_amount">Tổng tiền</label>
          <input type="number" id="total_amount" v-model="order.totalAmount" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="payment_method">Phương thức thanh toán</label>
          <select id="payment_method" v-model="order.paymentMethod" required class="form-select">
            <option value="credit_card">Thẻ tín dụng</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Tiền mặt</option>
            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
          </select>
        </div>

        <button type="submit" class="submit-button">
          Thêm Đơn Hàng
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { add } from '@/services/modules/order.api';
import { getAllBasic } from '@/services/modules/user.api';
import Navbar from '@/components/NavbarComponent.vue';

const users = ref([]);
const isMiniLoading = ref(false);
const order = ref({
  userId: '',
  totalAmount: '',
  shippingAddress: '',
  paymentMethod: 'credit_card',
  toPerson: '',
  phone: ''
});

const submitOrder = async () => {
  try {
    const response = await add(order.value);
    alert(response.data.message || "Đơn hàng được thêm thành công!");
    order.value = {
      userId: '',
      totalAmount: '',
      shippingAddress: '',
      paymentMethod: 'credit_card',
      toPerson: '',
      phone: ''
    };
  } catch (error) {
    console.error(error);
    alert("Lỗi khi thêm đơn hàng. Vui lòng thử lại.");
  }
};

onBeforeMount(() => {
  fetchUser();
});

const fetchUser = async () => {
  isMiniLoading.value = true;
  try {
    const response = await getAllBasic();
    if (Array.isArray(response.data)) {
      users.value = response.data;
    } else {
      throw new Error('Dữ liệu không phải là một mảng');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isMiniLoading.value = false;
  }
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #f7fafc;
}

.form-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  gap: 1.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 1rem;
}

.form {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: medium;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-input, .form-select, .form-textarea {
  border: 1px solid #cbd5e0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  outline: none;
  transition: border-color 0.15s;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #ecc94b;
}

.submit-button {
  width: 100%;
  background-color: #48bb78;
  color: white;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: background-color 0.15s;
}

.submit-button:hover {
  background-color: #38a169;
}
</style>

  
  <style scoped>
  textarea, input[type="number"] {
    width: 100%;
    margin-top: 5px;
  }
  button {
    background-color: #28a745;
    color: white;
  }
  button:hover {
    background-color: #218838;
  }
  </style>
  