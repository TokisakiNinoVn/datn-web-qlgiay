<template>
  <div class="main-navbar">
    <nav class="navbar">
      <router-link class="flex item-center items-center flex-col card-name-navbar" to="/home">
        <!-- <img class="image-logo" src="../assets/image.png" alt="Logo"> -->
        <img class="image-logo" src="https://i.pinimg.com/736x/75/11/c5/7511c5289164c5644782b76e9d122f20.jpg" alt="Logo">

        <span class="role-user" >Quản lý phòng trọ</span>
        <span class="name-user">Tokisaki Nino</span>
      </router-link>

      <!-- Lịch sử thay đổi -->
      <router-link class="item-navbar" to="/home">
        <!-- <ion-icon name="locate-outline"></ion-icon> -->
        <ion-icon name="home-outline"></ion-icon>
        Home
      </router-link>
      <!-- Lịch sử đăng nhập -->
      <!-- <router-link class="item-navbar" v-if="roles.history_login === 1" to="/history-auth"> -->
      <router-link class="item-navbar" to="/room-management">
        <!-- <ion-icon name="sync-outline"></ion-icon> -->
        <ion-icon name="albums-outline"></ion-icon>
        Quản lý phòng trọ
      </router-link>


      <!-- Lịch sử giao dịch -->
      <!-- <router-link class="item-navbar" v-if="roles.history_log === 1" to="/transaction-history">
        <ion-icon class="icon-item-navbar" name="sync-outline"></ion-icon>
        Các giao dịch
      </router-link> -->

      <!-- Phân quyền -->
      <!-- <router-link class="item-navbar" v-if="roles.manage_role === 1" to="/roles"> -->
      <router-link class="item-navbar" to="/roles">
        <!-- <ion-icon class="icon-item-navbar" name="trail-sign-outline"></ion-icon> -->
        <ion-icon class="icon-item-navbar" name="documents-outline"></ion-icon>
        Quản lý hóa đơn
      </router-link>

      <!-- Quản lý người dùng -->
      <!-- <router-link class="item-navbar" v-if="roles.manage_staff === 1" to="/staffs"> -->
      <!-- <router-link class="item-navbar" to="/staffs">
        <ion-icon name="person-circle-outline"></ion-icon>
        Quản lý người dùng
      </router-link> -->

      <!-- Quản lý người dùng -->
      <!-- <router-link class="item-navbar" v-if="roles.manage_user === 1" to="/customer-list"> -->
      <router-link class="item-navbar" to="/management-user">
        <ion-icon name="people-circle-outline"></ion-icon>
        Quản lý người dùng
      </router-link>

      <!-- Quản lý thông báo -->
      <!-- <router-link class="item-navbar" v-if="roles.manage_noti === 1" to="/notifications">
        <ion-icon class="icon-item-navbar" name="notifications-outline"></ion-icon>
        Quản lý thông báo
      </router-link> -->

      <!-- Quản lý khiếu nại -->
      <!-- <router-link class="item-navbar" v-if="roles.manage_complaint === 1" to="/complaints-management"> -->
      <router-link class="item-navbar" to="/complaints-management">
        <ion-icon class="icon-item-navbar" name="mail-outline"></ion-icon>
        Quản lý khiếu nại
      </router-link>

      <hr>

      <!-- Thông tin người dùng -->
      <router-link class="item-navbar" to="/user">
          <ion-icon name="person-circle-outline"></ion-icon>
          Tài khoản
        </router-link>

      <!-- Đăng xuất -->
      <a class="item-navbar" @click.prevent="handleLogout" href="#">
        <ion-icon name="log-out-outline"></ion-icon>
        Đăng xuất
      </a>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout } from '@/services/modules/auth.api';
// import { ref, onMounted } from 'vue';
import { onMounted } from 'vue';

const router = useRouter();
// const roles = ref({});

const handleLogout = async () => {
  alert('Bạn có chắc chắn muốn đăng xuất?');
  const userInfor = JSON.parse(localStorage.getItem('user'));
  const id = userInfor.id;
  const response = await logout(id);
  if (response.status === 200) {
    alert('Đăng xuất thành công');
    router.push('/login');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
  }
};
onMounted(() => {
  // roles.value = JSON.parse(localStorage.getItem('roles'));
  // console.log(roles);
  // console.log(roles.value);
});

</script>

<style scoped>
.main-navbar {
  position: relative;
  width: auto;
  background-color: #f1f1f1;
  height: 100vh;
}
.navbar {
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: flex-start;
  width: max-content;
}

.role-user, .name-user {
  font-size: 16px;
  font-weight: 600;
  color: rgb(0, 0, 0);
}

.role-user {
  margin-top: 20px;
}


.navbar a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
}
.navbar a:hover {
  background-color: #ffffff;
  border-bottom: 1px solid rgb(255, 170, 0);
  color: rgb(255, 170, 0);
}
.card-name-navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  background: rgb(255,255,255);
  background: linear-gradient(191deg, rgba(255,255,255,0.927608543417367) 0%, rgba(0, 255, 153, 0.76) 100%);
  border-bottom-right-radius: 10%;
  border-bottom-left-radius: 10%;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
.card-name-navbar:hover {
  border-bottom: none;
}

.image-logo {
  height: 100px;
  width: 100px;
  border-radius: 50%;
}
.item-navbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
ion-icon {
  margin-right: 8px;
}
hr {
  height: 2px; /* Độ dày của thanh ngang */
  background-color: rgb(255, 170, 0); /* Màu sắc của thanh ngang */
  border: none; /* Xóa bỏ đường viền mặc định */
}
</style>
