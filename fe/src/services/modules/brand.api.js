import instance from '@/services/axiosConfig';

const getListSimpleBrandApi = async () => instance.get(`/api/private/brand/list-simple`);
const getAllBrandApi = async () => instance.get(`/api/private/brand/all`);
const addBrandApi = async (data) => instance.post(`/api/private/brand/add`, data);
const updateBrandApi = async (data) => instance.put(`/api/private/brand/update`, data);
const deleteBrandApi = async (id) => instance.delete(`/api/private/brand/delete/${id}`);


export {
  getListSimpleBrandApi,
  getAllBrandApi,
  addBrandApi,
  updateBrandApi,
  deleteBrandApi
}