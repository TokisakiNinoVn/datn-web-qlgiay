import instance from '@/services/axiosConfig';

const add = async (data) => instance.post('api/private/notifications/', data);
const getAll = async () => instance.get('api/private/notifications/');


export {
  add,
  getAll,
};
