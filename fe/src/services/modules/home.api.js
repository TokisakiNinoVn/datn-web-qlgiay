import instance from '@/services/axiosConfig';

const getGeneralInfoApi = async () => instance.get(`/api/private/home/general-info`);


export {
  getGeneralInfoApi,
}