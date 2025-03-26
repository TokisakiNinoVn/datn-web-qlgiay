import instance from '@/services/axiosConfig';

const getListSimpleSupplierApi = async () => instance.get(`/api/private/supplier/list-simple`);
const getAllSupplierApi = async () => instance.get(`/api/private/supplier/all`);
const addSupplierApi = async (data) => instance.post(`/api/private/supplier/add`, data);
const updateSupplierApi = async (data) => instance.put(`/api/private/supplier/update`, data);
const deleteSupplierApi = async (id) => instance.delete(`/api/private/supplier/delete/${id}`);


export {
  getListSimpleSupplierApi,
  getAllSupplierApi,
  addSupplierApi,
  updateSupplierApi,
  deleteSupplierApi
}