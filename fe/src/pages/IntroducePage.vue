<template>
  <div id="app" class="container">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">Quản lý kho giày</h1>
        <nav class="nav">
          <a href="#" class="nav-link">
            <i class="fas fa-home mr-2"></i> Trang chủ
          </a>
          <a href="https://www.facebook.com" class="nav-link">
            <i class="fa-brands fa-facebook"></i> Liên hệ
          </a>
          <a href="https://github.com" class="nav-link">
            <i class="fa-brands fa-github"></i> Github
          </a>
          <router-link to="/login" class="nav-link">
            <i class="fas fa-sign-in-alt mr-2"></i> Đăng nhập
          </router-link>
        </nav>
      </div>
    </header>

    <main class="main">
      <section class="hero">
        <div class="hero-content">
          <h2 class="hero-title">Quản lý kho giày thông minh</h2>
          <p class="hero-subtitle">
            Tối ưu hóa việc quản lý hàng tồn kho với hệ thống hiện đại và thân thiện.
          </p>
          <router-link v-if="!isAuthenticated" to="/login" class="hero-btn">
            Bắt đầu ngay
          </router-link>
          <router-link v-else to="/login" class="hero-btn">
            Vào bảng điều khiển
          </router-link>
        </div>
        <div class="hero-image">
          <img class="image-kajwd" src="https://i.pinimg.com/736x/a1/39/ec/a139ecb1bbf77714f995ab47d9d34487.jpg" alt="Shoe Inventory" />
        </div>
      </section>

      <section class="features">
        <h3 class="features-title">Tính năng chính</h3>
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-shoe-prints fa-2x"></i>
            <h4>Quản lý sản phẩm</h4>
            <p>Kiểm soát số lượng, mẫu mã giày trong kho.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-box-open fa-2x"></i>
            <h4>Theo dõi tồn kho</h4>
            <p>Cập nhật trạng thái nhập/xuất kho nhanh chóng.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-chart-line fa-2x"></i>
            <h4>Báo cáo doanh thu</h4>
            <p>Phân tích dữ liệu bán hàng hiệu quả.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© 2025 Quản lý kho giày. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const isAuthenticated = computed(() => !!localStorage.getItem('token'));

    return {
      isAuthenticated,
      router,
    };
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  color: #1a1a1a;
  background: linear-gradient(120deg, #5292ed 0%, #f9e8d9 100%);
  display: flex;
  flex-direction: column;
}

.header {
  background: #ffffff;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  padding: 0rem 2rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
}

.header-content {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ff6f61;
}

.nav {
  display: flex;
  gap: 2.5rem;
}

.nav-link {
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ff6f61;
}

.main {
  flex: 1;
  padding: 6rem 2rem 2rem;
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  margin-bottom: 5rem;
  flex-wrap: wrap;
}

.hero-content {
  flex: 1;
  text-align: left;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1.2rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #4a4a4a;
  margin-bottom: 2rem;
}

.hero-btn {
  padding: 1rem 2.5rem;
  background: #ff6f61;
  color: #fff;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  background: #e65b50;
  transform: scale(1.05);
}

.hero-image img {
  max-width: 300px;
  width: 100%;
  border-radius: 50%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.features {
  text-align: center;
}

.features-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.feature-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card i {
  color: #ff6f61;
  margin-bottom: 1.2rem;
}

.feature-card h4 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.8rem;
}

.feature-card p {
  color: #4a4a4a;
}

.footer {
  background: #1a1a1a;
  color: #fff;
  padding: 1.5rem;
  text-align: center;
  font-size: 1rem;
}

i {
  margin-right: 8px;
}
</style>