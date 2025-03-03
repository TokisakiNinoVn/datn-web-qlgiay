import instance from '@/services/axiosConfig';

const login = async ({phone, password}) => instance.post('/api/public/auth/login', {phone, password});
const logout = async (id) => instance.post('/api/public/auth/logout', {id});

export {
  login,
  logout
}