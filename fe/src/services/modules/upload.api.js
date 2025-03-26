//upload.api.js
import instance from '@/services/axiosConfig';
const uploadApi = async (formData) => instance.post('/api/private/upload/', 
    formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
const uploadNormalApi = async (formData) => instance.post('/api/private/upload/file', 
    formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export {
    uploadApi,
    uploadNormalApi
};
