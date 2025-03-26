<template>
  <div class="login-wrapper">
    <div class="login-overlay"></div>
    <div class="login-container">
      <div class="login-header">
        <img src="https://i.pinimg.com/736x/bd/b3/43/bdb3431621a98e8b1f1ec6724815fd1c.jpg" alt="Logo" class="logo" />
        <h2 class="login-title">Đăng nhập hệ thống</h2>
        <p class="login-subtitle">Quản lý kho giày dễ dàng hơn bao giờ hết</p>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="phone" class="form-label">
            <i class="fas fa-phone-alt"></i> Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            v-model="phone"
            required
            placeholder="Nhập số điện thoại"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">
            <i class="fas fa-lock"></i> Mật khẩu
          </label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              required
              placeholder="Nhập mật khẩu"
              class="form-input"
            />
            <i
              :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              class="toggle-password"
              @click="togglePassword"
              style="cursor: pointer; margin-right: 0.5rem;"
            ></i>
          </div>
        </div>

        <button type="submit" class="login-btn">
          <i class="fas fa-sign-in-alt"  style="cursor: pointer; margin-right: 0.5rem;"></i> Đăng nhập
        </button>

        <div class="extra-options">
          <router-link to="/forget-password">Quên mật khẩu?</router-link>
          <!-- <button @click="forgetPassword" class="forgot-btn"> -->
          <!-- </button> -->
          <!-- <router-link to="/register" class="register-link">
            Chưa có tài khoản? Đăng ký ngay
          </router-link> -->
        </div>

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-circle mr-1"></i> {{ errorMessage }}
        </div>
      </form>

      <!-- <div class="social-login">
        <p>Hoặc đăng nhập bằng</p>
        <div class="social-buttons">
          <button class="social-btn google-btn">
            <i class="fab fa-google"></i> Google
          </button>
          <button class="social-btn facebook-btn">
            <i class="fab fa-facebook-f"></i> Facebook
          </button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/modules/auth.api';

const phone = ref('');
const password = ref('');
const errorMessage = ref('');
const showPassword = ref(false);
const router = useRouter();

onMounted(() => {
  // Chặn quay lại trang trước đó
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', () => {
    history.pushState(null, null, location.href);
  });

  localStorage.setItem('isLoggedIn', 'false');
  localStorage.setItem('token', '');
});

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    const response = await login({ phone: phone.value, password: password.value });
    const { data } = response.data;

    const roles = data.role[0].code;
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('roles', JSON.stringify(data.role[0]));
    localStorage.setItem('loginTime', new Date().getTime());
    if (roles === 'staff') router.push('/home-staff');
    else router.push('/home');

  } catch (error) {
    console.log(error);
    errorMessage.value = error.response?.data?.message || 'Đăng nhập thất bại';
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background: linear-gradient(145deg, #ff6f61 0%, #ff9f1c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/cubes.png');
  opacity: 0.1;
  z-index: 1;
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 100px;
  margin-bottom: 1rem;
  border-radius: 50%;
}

.login-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: 1px;
}

.login-subtitle {
  font-size: 1rem;
  color: #666;
  margin-top: 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.6rem;
  font-weight: 600;
}

.form-label i {
  margin-right: 0.6rem;
  color: #ff6f61;
}

.form-input {
  width: 90%;
  padding: 0.9rem 1.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #ff6f61;
  box-shadow: 0 0 8px rgba(255, 111, 97, 0.3);
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  font-size: 1.1rem;
}

.login-btn {
  padding: 1rem;
  background: #ff6f61;
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-btn:hover {
  background: #e65b50;
  transform: scale(1.02);
}

.extra-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.forgot-btn {
  background: transparent;
  border: none;
  color: #ff6f61;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.forgot-btn:hover {
  color: #e65b50;
  text-decoration: underline;
}

.register-link {
  color: #ff6f61;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.register-link:hover {
  color: #e65b50;
  text-decoration: underline;
}

.error-message {
  color: #d32f2f;
  font-size: 0.9rem;
  text-align: center;
  padding: 0.8rem;
  background: #ffebee;
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-login {
  margin-top: 2rem;
  text-align: center;
}

.social-login p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.social-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.google-btn {
  background: #fff;
  color: #4285f4;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.google-btn:hover {
  background: #f1f1f1;
}

.facebook-btn {
  background: #3b5998;
  color: white;
}

.facebook-btn:hover {
  background: #344e86;
}
</style>