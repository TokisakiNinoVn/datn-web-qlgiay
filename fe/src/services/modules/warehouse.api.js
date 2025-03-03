import instance from '@/services/axiosConfig';

const getListWarehouseApi = async () => instance.get(`/api/private/warehouse/list`);
const createWarehouseApi = async (data) => instance.post(`/api/private/warehouse/create`, data);
const updateWarehouseApi = async (data) => instance.put(`/api/private/warehouse/update`, data);
const deleteWarehouseApi = async (id) => instance.delete(`/api/private/warehouse/delete/${id}`);


export {
  getListWarehouseApi,
  createWarehouseApi,
  updateWarehouseApi,
  deleteWarehouseApi

}