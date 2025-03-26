import instance from '@/services/axiosConfig';

const getGeneralInfoApi = async () => instance.get(`/api/private/statistics/general-info`);


export {
  getGeneralInfoApi,
}