import instance from '@/services/axiosConfig';

const createExportWarehouseApi = async (data) => instance.post(`/api/private/export-warehouse/create`, data);
const getAllExportWarehouseApi = async () => instance.get(`/api/private/export-warehouse/export-all`);
const getExportWarehouseByIdApi = async (id) => instance.get(`/api/private/export-warehouse/details/${id}`);
const deleteExportWarehouseApi = async (id) => instance.delete(`/api/private/export-warehouse/${id}`);


export {
  createExportWarehouseApi,
  getAllExportWarehouseApi,
  getExportWarehouseByIdApi,
  deleteExportWarehouseApi
}