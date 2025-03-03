import instance from '@/services/axiosConfig';

const addRoleApi = async (data) => instance.post('api/private/role/create', data);
const editRoleApi = async (data) => instance.put(`api/private/role/edit`, data);
const deleteRoleApi = async (data) => instance.post('api/private/role/delete', data);

const getAllRoleApi = async () => instance.get('api/private/role/all');
const getBasicRoleApi = async () => instance.get('api/private/role/basic');
const getStaffByRoleApi = async (id) => instance.get(`api/private/role/a/${id}`);

export {
  addRoleApi,
  editRoleApi,
  deleteRoleApi,
  getAllRoleApi,
  getStaffByRoleApi,
  getBasicRoleApi,
};
