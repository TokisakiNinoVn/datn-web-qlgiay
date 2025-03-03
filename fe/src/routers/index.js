// src/routers/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/HomePage.vue';
import Introduce from '@/pages/IntroducePage.vue';
import Login from '@/pages/LoginPage.vue';
import NotFound from '@/pages/NotFoundPage.vue';
import ComplaintsManagementPage from '@/backup/ComplaintsManagementPage.vue';
import UserManagerment from '@/pages/admin/user/UserManagerment.vue';
import InforPage from '@/pages/InforPage.vue';
// import OrderCreate from '@/pages/order/OrderCreate.vue';

//Staff
import ManagermentStaff from '@/pages/staff/ManagermentStaff.vue';

//Role
// import ManagermentRole from '@/pages/role/ManagermentRole.vue';

//Warehouse
import WarehouseManagement from '@/pages/admin/warehouse/WarehouseManagement.vue';
// import RoomDetails from '@/pages/room/RoomDetail.vue';
import AddWarehouse from '@/pages/admin/warehouse/AddWarehouse.vue';

//Supplier
import ManagermentSupplier from '@/pages/admin/supplier/ManagermentSupplier.vue';
//Category
import ManagermentCategory from '@/pages/admin/category/ManagermentCategory.vue';
//Brand
import ManagermentBrand from '@/pages/admin/brand/ManagermentBrand.vue';

const routes = [
  { path: '/', component: Introduce },
  { path: '/login', component: Login },
  { path: '/complaints-management', component: ComplaintsManagementPage },
  { path: '/management-user', component: UserManagerment },
  { path: '/profile', component: InforPage },
  // { path: '/vouchers', component: VoucherManagement },
  // { path: '/notifications', component: NotiManagement },
  // { path: '/create-order', component: OrderCreate },
  
  { path: '/staffs', component: ManagermentStaff },
  // { path: '/roles', component: ManagermentRole },
  
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  
  { path: '/warehouse-management', component: WarehouseManagement },
  { path: '/warehouse-management/add', component: AddWarehouse },
  // { path: '/room/details/:id', component: RoomDetails },

  //Managerment Supplier
  { path: '/supplier-management', component: ManagermentSupplier },
  
  { path: '/category-management', component: ManagermentCategory },

  { path: '/brand-management', component: ManagermentBrand },
  
    
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLogin = !!localStorage.getItem('isLoggedIn'); 

  if (isLogin == 'false') {
    next('/login');
  } else {
    next();
  }
});

export default router;
