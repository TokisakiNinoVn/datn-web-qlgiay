// auth.api.js
import instance from '@/services/axiosConfig';

const getAll = async () => instance.get('/api/private/staff/all');
const getAllBasic = async () => instance.get('/api/private/staff/basic');

const add = async (data) => instance.post('/api/private/staff/add', data);

const getById = async (id) => instance.get(`/api/private/staff/${id}`);

const update = async (id, data) =>
  instance.put(`/api/private/staff/${id}`, data);

const remove = async (id, data) => instance.post(`/api/private/staff/${id}`, data);
const freezeApi = async (id, data) => instance.post(`/api/private/staff/freeze/${id}`, data);

// const search = async (query) =>
//   instance.post('/api/private/staff/search', { query });

// const filterByRole = async (role) =>
//   instance.post('/api/private/staff/filter', { role });

export {
  getAllBasic,
  getAll,
  add,
  getById,
  update,
  remove,
  freezeApi
  // search,
  // filterByRole
};
