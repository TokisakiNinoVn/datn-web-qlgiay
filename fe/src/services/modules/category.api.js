import instance from '@/services/axiosConfig';

const getListSimpleCategoryApi = async () => instance.get(`/api/private/category/list-simple`);
const getAllCategoryApi = async () => instance.get(`/api/private/category/all`);
const addCategoryApi = async (data) => instance.post(`/api/private/category/add`, data);
const updateCategoryApi = async (data) => instance.put(`/api/private/category/update`, data);
const deleteCategoryApi = async (id) => instance.delete(`/api/private/category/delete/${id}`);


export {
  getListSimpleCategoryApi,
  getAllCategoryApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi
}