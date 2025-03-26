import instance from '@/services/axiosConfig';

// API cho product
const getAllProductApi = async () => instance.get(`/api/private/product/all`);
const getForAddApi = async () => instance.get(`/api/private/product/for-add`);
const getListProductApi = async () => instance.get(`/api/private/product/all-simple`);
const getDetailsProductByIdApi = async (id) => instance.get(`/api/private/product/details/${id}`);

const addProductApi = async (data) => instance.post(`/api/private/product/add`, data);
const updateProductApi = async (data) => instance.put(`/api/private/product/`, data);
const deleteProductApi = async (id) => instance.delete(`/api/private/product/${id}`);

export {
  getAllProductApi,
  getListProductApi,
  getDetailsProductByIdApi,
  addProductApi,
  updateProductApi,
  deleteProductApi,
  getForAddApi
};