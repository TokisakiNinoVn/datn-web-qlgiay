import instance from '@/services/axiosConfig';

// add response
const add = async (data) => instance.post('api/private/response/', data);

export {
  add,
};
