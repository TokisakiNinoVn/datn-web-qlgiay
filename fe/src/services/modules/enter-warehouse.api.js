import instance from '@/services/axiosConfig';

const createEnterWarehouseApi = async (data) => instance.post(`/api/private/enter-warehouse/create`, data);
const getAllEnterWarehouseApi = async () => instance.get(`/api/private/enter-warehouse/all`);
const getEnterWarehouseByIdApi = async (id) => instance.get(`/api/private/enter-warehouse/details/${id}`);
const deleteEnterWarehouseApi = async (id) => instance.delete(`/api/private/enter-warehouse/${id}`);


export {
  createEnterWarehouseApi,
  getAllEnterWarehouseApi,
  getEnterWarehouseByIdApi,
  deleteEnterWarehouseApi
}