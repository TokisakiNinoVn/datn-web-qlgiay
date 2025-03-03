<template>
    <div class="flex w-screen h-screen bg-gray-100">
      <Navbar />
      <div class="flex flex-col w-full p-6">
        <div class="flex flex-col mb-4">
          <h1 class="text-2xl font-bold mb-2">Danh sách khách hàng</h1>
          <div class="flex items-center mb-2">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Nhập thông tin cần tìm kiếm..."
              class="border border-gray-300 rounded-lg p-2 mr-2 flex-grow focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button 
              class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition" 
              @click="searchCustomer" 
              :disabled="isMiniLoading || !searchQuery">
              <ion-icon name="search-outline"></ion-icon>
            </button>
          </div>
          <div class="flex items-center mb-4">
            <select v-model="selectedRole" class="border border-gray-300 rounded-lg p-2 mr-2 focus:outline-none focus:ring focus:ring-blue-500">
              <option value="khách hàng">Khách hàng</option>
              <option value="nhân viên">Nhân viên</option>
            </select>
            <button 
              class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition" 
              @click="filterByRoleD(selectedRole)" 
              :disabled="isMiniLoading">
              <ion-icon name="search-outline"></ion-icon>
              Tìm kiếm
            </button>
  
            <button> 
              <!-- button làm mới lại bảng: xóa các điều kiện lọc hoặc tìm kiếm, như kiểu làm mới lại trang ấy -->
              <ion-icon name="refresh-outline"></ion-icon>
              Xóa các điều kiện (Làm mới bảng)
            </button>
          </div>
        </div>
  
        <div class="overflow-x-auto">
          <button @click="addCustomer" class="bg-green-500 text-white rounded-lg px-4 py-2 mb-4 hover:bg-green-600 transition">
            <ion-icon name="add-outline"></ion-icon> Thêm khách hàng
          </button>
          <table v-if="customers.length > 0" class="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead class="bg-gray-100">
              <tr>
                <th class="border-b border-gray-300 p-2 text-left">ID</th>
                <th class="border-b border-gray-300 p-2 text-left">Tên đăng nhập</th>
                <th class="border-b border-gray-300 p-2 text-left">Tên</th>
                <th class="border-b border-gray-300 p-2 text-left">Email</th>
                <th class="border-b border-gray-300 p-2 text-left">Điện thoại</th>
                <th class="border-b border-gray-300 p-2 text-left">Địa chỉ</th>
                <th class="border-b border-gray-300 p-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50">
                <td class="border-b border-gray-300 p-2">{{ customer.id || '' }}</td>
                <td class="border-b border-gray-300 p-2">{{ customer.username || '' }}</td>
                <td class="border-b border-gray-300 p-2">{{ customer.name || '' }}</td>
                <td class="border-b border-gray-300 p-2">{{ customer.email || '' }}</td>
                <td class="border-b border-gray-300 p-2">{{ customer.phone || '' }}</td>
                <td class="border-b border-gray-300 p-2">{{ customer.address || '' }}</td>
                <td class="border-b border-gray-300 p-2">
                  <button @click="updateCustomer(customer)" class="text-yellow-500 hover:text-yellow-700 transition" title="Cập nhật">
                    <ion-icon name="pencil-outline"></ion-icon>
                  </button>
                  <button @click="viewCustomer(customer)" class="text-blue-500 hover:text-blue-700 transition" title="Xem chi tiết">
                    <ion-icon name="eye-outline"></ion-icon>
                  </button>
                  <button @click="removeCustomer(customer.id)" class="text-red-500 hover:text-red-700 transition" title="Xóa">
                    <ion-icon name="trash-outline"></ion-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="text-center mt-4">
            Không có dữ liệu!
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onBeforeMount } from 'vue';
  import Navbar from '../../components/NavbarComponent.vue';
  import {
    getAll,
    // search,
    remove,
    filterByRole
  } from '@/services/modules/user.api';
  
  const customers = ref([]);
  const isMiniLoading = ref(false);
  const searchQuery = ref('');
  const selectedRole = ref('khách hàng');
  
  onBeforeMount(() => {
    fetchCustomers();
  });
  
  const fetchCustomers = async () => {
    isMiniLoading.value = true;
    try {
      const response = await getAll();
      if (Array.isArray(response.data)) {
        customers.value = response.data;
      } else {
        throw new Error('Dữ liệu không phải là một mảng');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Không thể lấy thông tin khách hàng. Vui lòng thử lại sau.');
      customers.value = []; // Reset customers on error
    } finally {
      isMiniLoading.value = false;
    }
  };
  
  const addCustomer = () => {
    // Logic to open the form for adding a new customer
    console.log('Adding new customer');
  };
  
  const updateCustomer = (customer) => {
    console.log('Updating customer:', customer);
    // Logic to update the customer
  };
  
  const viewCustomer = (customer) => {
    console.log('Viewing customer:', customer);
    // Logic to view the customer details
  };
  
  const removeCustomer = async (id) => {
    const confirmDelete = confirm('Bạn có chắc chắn muốn xóa khách hàng này?');
    if (confirmDelete) {
      try {
        await remove(id);
        customers.value = customers.value.filter(customer => customer.id !== id);
        alert('Khách hàng đã được xóa!');
      } catch (error) {
        console.error('Error removing customer:', error);
        alert('Có lỗi xảy ra khi xóa khách hàng. Vui lòng thử lại.');
      }
    }
  };
  
  const searchCustomer = () => {
    if (!searchQuery.value) {
      alert('Vui lòng nhập thông tin cần tìm kiếm.');
      return;
    }
  
    const filteredCustomers = customers.value.filter(customer => 
      customer.username.includes(searchQuery.value) ||
      customer.name.includes(searchQuery.value) ||
      customer.email.includes(searchQuery.value)
    );
  
    customers.value = filteredCustomers.length ? filteredCustomers : [];
    if (filteredCustomers.length === 0) {
      alert('Không tìm thấy khách hàng nào.');
    }
  };
  
  const filterByRoleD = async (role) => {
    console.log('Filtering by role:', role);
    isMiniLoading.value = true;
  
    try {
      const filteredCustomers = await filterByRole(role);
      if (Array.isArray(filteredCustomers.data)) {
        customers.value = filteredCustomers.data;
      } else {
        throw new Error('Dữ liệu không phải là một mảng');
      }
    } catch (error) {
      console.error('Error filtering customers:', error);
      alert('Không thể lọc thông tin khách hàng. Vui lòng thử lại sau.');
      customers.value = []; // Reset customers on error
    } finally {
      isMiniLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Bỏ qua CSS riêng biệt vì đã sử dụng Tailwind */
  </style>
  
  Yêu cầu: bắt sự kiện cho việc làm mới bảng, thêm các component hoặc 1 div hiển thị để thêm, sửa, xem chi tiết 1 customer cụ thể theo các api "import {
    getAll,
    // search,
    update, //  api cập nhật thông tin khách hàng
    add, // api thêm mới khách hàng
    remove,
    filterByRole
  } from '@/services/modules/user.api';". 
  hàm phía BE"// Thêm người dùng mới
  exports.add = async (req, res, next) => {
    const { username, email, password, phone, name, address, gender } = req.body;
  
    try {
      // Kiểm tra xem username đã tồn tại
      const checkUsernameSql = `SELECT * FROM Users WHERE username = ?`;
      const [usernameResult] = await db.pool.execute(checkUsernameSql, [username]);
  
      // Kiểm tra xem email đã tồn tại
      const checkEmailSql = `SELECT * FROM Users WHERE email = ?`;
      const [emailResult] = await db.pool.execute(checkEmailSql, [email]);
  
      if (usernameResult.length > 0) {
        return res.status(400).json({ error: "Tên người dùng đã tồn tại!" });
      }
  
      if (emailResult.length > 0) {
        return res.status(400).json({ error: "Email đã được đăng ký!" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const sql = `
        INSERT INTO Users (username, email, role, password, phone, name, address, gender, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const userData = [
        username,
        email,
        'khách hàng',
        hashedPassword,
        phone || null, 
        name || null,
        address || null,
        gender || null 
      ];
  
      const [result] = await db.pool.execute(sql, userData);
  
      res.status(201).json({ message: "Thêm mới khách hàng thành công!", userId: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; " và "// Cập nhật thông tin người dùng
  exports.updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, phone, address, gender } = req.body;
  
    try {
      const sql = `UPDATE Users SET name = ?, phone = ?, address = ?, gender = ? WHERE id = ?`;
      await db.pool.execute(sql, [name, phone, address, gender, id]);  // Thay đổi ở đây
  
      res.json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; "