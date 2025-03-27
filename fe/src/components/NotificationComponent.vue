<template>
  <div v-if="visible" :class="['notification', type, 'fade-in']">
    <i :class="iconClass"></i>
    <span>{{ message }}</span>
    <button @click="closeNotification">&times;</button>
    <div class="progress-bar" :style="{ width: progressWidth }"></div>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    type: {
      type: String,
      default: 'error' // success or error
    },
    duration: {
      type: Number,
      default: 3000 // 3 seconds
    }
  },
  data() {
    return {
      visible: false,
      progressWidth: '100%' // Bắt đầu từ 100%
    };
  },
  computed: {
    iconClass() {
      return this.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }
  },
  methods: {
    showNotification() {
      this.visible = true;
      this.progressWidth = '100%';

      // Giảm chiều rộng thanh tiến trình
      let startTime = Date.now();
      const interval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        this.progressWidth = `${100 - (elapsed / this.duration) * 100}%`;

        if (elapsed >= this.duration) {
          clearInterval(interval);
          this.visible = false;
        }
      }, 30); // Cập nhật mỗi 30ms
    },
    closeNotification() {
      this.visible = false;
    }
  },
  mounted() {
    this.showNotification();
  }
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  max-width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  overflow: hidden;
  z-index: 1000;
}
.success {
  background-color: #4caf50;
}
.error {
  background-color: #f44336;
}
button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
}

.fade-in {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: white;
  width: 100%;
  transition: width linear;
}

i {
  margin-right: 10px;
  font-size: 20px;
}
</style>
