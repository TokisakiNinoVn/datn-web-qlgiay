import instance from '@/services/axiosConfig';

// Get all complaint
const getAll = async () => instance.get('api/private/orders/');
const add = async (data) => instance.post('api/private/orders/', data);


export {
  getAll,
  add
};
