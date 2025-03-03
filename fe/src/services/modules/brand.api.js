import instance from '@/services/axiosConfig';

// const getListBrandApi = async () => instance.get(`/api/private/brand/list-simple`);
const getAllBrandApi = async () => instance.get(`/api/private/brand/all`);
const addBrandApi = async (data) => instance.post(`/api/private/brand/add`, data);
const updateBrandApi = async (data) => instance.put(`/api/private/brand/update`, data);
const deleteBrandApi = async (id) => instance.delete(`/api/private/brand/delete/${id}`);


export {
  // getListBrandApi,
  getAllBrandApi,
  addBrandApi,
  updateBrandApi,
  deleteBrandApi
}