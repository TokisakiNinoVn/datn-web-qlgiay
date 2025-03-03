// auth.api.js
import instance from '@/services/axiosConfig';

const getUserAllApi = async () => instance.get('/api/private/user/all');
const getAllUserWithRoleApi = async () => instance.get('/api/private/user/users-role');
const getAllUserSimpleApi = async () => instance.get('/api/private/user/users-simple');

const addUserApi = async (data) => instance.post('/api/private/user/add', data);

const getUserByIdApi = async (id) => instance.get(`/api/private/user/${id}`);

const updateUserApi = async (id, data) => instance.put(`/api/private/user/${id}`, data);

const removeUserApi = async (id) => instance.delete(`/api/private/user/${id}`);

const searchApi = async (query) => instance.post('/api/private/user/search', { query });

const filterByRoleApi = async (role) => instance.post('/api/private/user/filter', { role });

export {
  getAllUserWithRoleApi,
  getAllUserSimpleApi,
  getUserAllApi,
  addUserApi,
  getUserByIdApi,
  updateUserApi,
  removeUserApi,
  searchApi,
  filterByRoleApi
};
