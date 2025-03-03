import instance from '@/services/axiosConfig';

// Get all complaint
const getAll = async () => instance.get('api/private/complaints/');
const createApi = async (data) => instance.post('api/private/complaints/create-response', data);


export {
  getAll,
  createApi
};
