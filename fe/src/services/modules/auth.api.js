import instance from '@/services/axiosConfig';

const login = async ({phone, password}) => instance.post('/api/public/auth/login', {phone, password});
const logout = async (id) => instance.post('/api/public/auth/logout', {id});
const getOTPApi = async (data) => instance.post('/api/public/auth/get-otp', data);
const verifyOtpApi = async (data) => instance.post('/api/public/auth/verify-otp', data);
const resetPasswordApi = async (data) => instance.post('/api/public/auth/reset-password', data);

export {
  login,
  logout,
  getOTPApi,
  verifyOtpApi,
  resetPasswordApi
}