<template>
    <div class="container">
      <div class="auth-card">
        <h2 class="title">{{ step === 1 ? 'Quên mật khẩu' : step === 2 ? 'Xác nhận OTP' : 'Đặt lại mật khẩu' }}</h2>
  
        <!-- Bước 1: Nhập số điện thoại -->
        <form v-if="step === 1" @submit.prevent="requestOtp" class="form">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-phone mr-2"></i> Số điện thoại
            </label>
            <input
              v-model="phone"
              type="text"
              class="form-input"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <button type="submit" class="submit-btn" :disabled="loading">
            <i class="fas fa-paper-plane mr-2"></i> Gửi OTP
            <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
          </button>
        </form>
  
        <!-- Bước 2: Xác nhận OTP -->
        <form v-if="step === 2" @submit.prevent="verifyOtp" class="form">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-key mr-2"></i> Mã OTP
            </label>
            <input
              v-model="otp"
              type="text"
              class="form-input"
              placeholder="Nhập mã OTP"
              required
            />
          </div>
          <button type="submit" class="submit-btn" :disabled="loading">
            <i class="fas fa-check mr-2"></i> Xác nhận OTP
            <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
          </button>
          <p class="resend-text">
            Chưa nhận được mã? <a @click="requestOtp" href="#">Gửi lại</a>
          </p>
        </form>
  
        <!-- Bước 3: Đặt lại mật khẩu -->
        <form v-if="step === 3" @submit.prevent="resetPassword" class="form">
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock mr-2"></i> Mật khẩu mới
            </label>
            <input
              v-model="newPassword"
              type="password"
              class="form-input"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-lock mr-2"></i> Xác nhận mật khẩu
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>
          <button type="submit" class="submit-btn" :disabled="loading">
            <i class="fas fa-save mr-2"></i> Đặt lại mật khẩu
            <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
          </button>
        </form>
  
        <router-link to="/login" class="back-link">
          <i class="fas fa-arrow-left mr-2"></i> Quay lại đăng nhập
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { getOTPApi, verifyOtpApi, resetPasswordApi } from '@/services/modules/auth.api';
  
  const router = useRouter();
  const step = ref(1);
  const phone = ref('');
  const otp = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const loading = ref(false);
  
  const requestOtp = async () => {
    loading.value = true;
    try {
      const response = await getOTPApi({ phone: phone.value });
      alert('Mã OTP của bạn' + response.data.code);
      step.value = 2;
    } catch (error) {
      console.error('Lỗi khi gửi OTP:', error);
      alert('Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại!');
    } finally {
      loading.value = false;
    }
  };
  
  const verifyOtp = async () => {
    loading.value = true;
    try {
      await verifyOtpApi({ phone: phone.value, otp: otp.value });
      alert('Xác nhận OTP thành công!');
      step.value = 3;
    } catch (error) {
      console.error('Lỗi khi xác nhận OTP:', error);
      alert('Mã OTP không đúng. Vui lòng thử lại!');
    } finally {
      loading.value = false;
    }
  };
  
  const resetPassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
  
    loading.value = true;
    try {
      await resetPasswordApi({ phone: phone.value, password: newPassword.value });
      alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      router.push('/login');
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error);
      alert('Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại!');
    } finally {
      loading.value = false;
    }
};
  

  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    background: #f4f6f9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .auth-card {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .title {
    font-size: 1.75rem;
    color: #343a40;
    font-weight: 700;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-label {
    font-size: 1rem;
    color: #555;
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  
  .form-input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .form-input:focus {
    border-color: #007bff;
    outline: none;
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
    justify-content: center;
    transition: background 0.3s ease;
  }
  
  .submit-btn:hover {
    background: #0056b3;
  }
  
  .submit-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
  
  .resend-text {
    text-align: center;
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .resend-text a {
    color: #007bff;
    text-decoration: none;
    cursor: pointer;
  }
  
  .resend-text a:hover {
    text-decoration: underline;
  }
  
  .back-link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.5rem;
    color: #007bff;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s ease;
  }
  
  .back-link:hover {
    color: #0056b3;
  }
  </style>