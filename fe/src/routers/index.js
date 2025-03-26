// src/routers/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/HomePage.vue';
import HomeStaff from '@/pages/staff/HomeStaff.vue';
import Introduce from '@/pages/IntroducePage.vue';
import Login from '@/pages/LoginPage.vue';
import NotFound from '@/pages/NotFoundPage.vue';
import UserManagerment from '@/pages/admin/user/UserManagerment.vue';
import UpdateUser from '@/pages/admin/user/UpdateUser.vue';
import InforPage from '@/pages/InforPage.vue';

//Warehouse
import WarehouseManagement from '@/pages/admin/warehouse/WarehouseManagement.vue';
import AddWarehouse from '@/pages/admin/warehouse/AddWarehouse.vue';

//Supplier
import ManagermentSupplier from '@/pages/admin/supplier/ManagermentSupplier.vue';
//Category
import ManagermentCategory from '@/pages/admin/category/ManagermentCategory.vue';
//Brand
import ManagermentBrand from '@/pages/admin/brand/ManagermentBrand.vue';
//Product
import ProductManagerment from '@/pages/admin/product/ProductManagerment.vue';
import AddProduct from '@/pages/admin/product/AddProduct.vue';
import UpdateProduct from '@/pages/admin/product/UpdateProduct.vue';
import DetailProduct from '@/pages/admin/product/DetailProduct.vue';

//Enter Warehouse
import EnterWarehouseManagement from '@/pages/admin/enter-warehouse/ManagermentEnterWarehouse.vue';
import DetailEnterWarehouse from '@/pages/admin/enter-warehouse/DetailEnterWarehouse.vue';
import AddEnterWarehouse from '@/pages/admin/enter-warehouse/AddEnterWarehouse.vue';

import ExportWarehouseManagement from '@/pages/admin/export-warehouse/ManagermentExportWarehouse.vue';
import DetailExportWarehouse from '@/pages/admin/export-warehouse/DetailExportWarehouse.vue';
import AddExportWarehouse from '@/pages/admin/export-warehouse/AddExportWarehouse.vue';
import StatisticsPage from '@/pages/admin/StatisticsPage.vue';

import forgetPassword from '@/pages/forgetPassword.vue';

const routes = [
  { path: '/', component: Introduce },
  { path: '/login', component: Login },
  { path: '/management-user', component: UserManagerment },
  { path: '/update-user/:id', component: UpdateUser },
  { path: '/profile', component: InforPage },
  
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { path: '/home-staff', component: HomeStaff, meta: { requiresAuth: true } },
  
  { path: '/warehouse-management', component: WarehouseManagement },
  { path: '/warehouse-management/add', component: AddWarehouse },

  { path: '/supplier-management', component: ManagermentSupplier },
  
  { path: '/category-management', component: ManagermentCategory },

  { path: '/brand-management', component: ManagermentBrand },
  
  { path: '/product-management', component: ProductManagerment },
  { path: '/add-product', component: AddProduct },
  { path: '/edit-product/:id', component: UpdateProduct },
  { path: '/details-product/:id', component: DetailProduct },
  
  { path: '/enter-management', component: EnterWarehouseManagement },
  { path: '/enterwarehouse-create', component: AddEnterWarehouse },
  { path: '/details-enterwarehouse/:id', component: DetailEnterWarehouse },

  { path: '/export-management', component: ExportWarehouseManagement },
  { path: '/exportwarehouse-create', component: AddExportWarehouse },
  { path: '/details-exportwarehouse/:id', component: DetailExportWarehouse },
  
  { path: '/statistics', component: StatisticsPage },

  { path: '/forget-password', component: forgetPassword },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLogin = !!localStorage.getItem('isLoggedIn');
  // console.log(isLogin);
  // const role = localStorage.getItem('roles');

  // if(role.code == 'admin') {
  //   // if (to.path == '/login') {
  //     next('/home');
  //   // }
  // }
  // else {
    // alert('Bạn không có quyền truy cập vào trang này');
  //   next('/login');
  // }

  if (isLogin == 'false') {
    alert('Bạn không có quyền truy cập vào trang này');
    next('/login');
  } else {
    next();
  }
});

export default router;
