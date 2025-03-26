import instance from '@/services/axiosConfig';

// Get all vouchers
const getAllVouchers = async () => instance.get('api/private/vouchers/');

// Add a new voucher
const addVoucher = async (voucherData) => instance.post('api/private/vouchers/', voucherData);

// Update a voucher by ID
const updateVoucher = async (id, voucherData) => instance.put(`api/private/vouchers/${id}`, voucherData);

// Delete a voucher by ID
const deleteVoucher = async (id) => instance.delete(`api/private/vouchers/${id}`);

// Search for vouchers by ID or code
const searchVoucher = async (query) => instance.get(`api/private/vouchers/search`, { params: { query } });

// Filter expired vouchers
const filterExpiredVouchers = async () => instance.get('api/private/vouchers/expired');

// Filter active vouchers
const filterActiveVouchers = async () => instance.get('api/private/vouchers/active');

// Filter usable vouchers
const filterUsableVouchers = async () => instance.get('api/private/vouchers/usable');

// Filter used-out vouchers
const filterUsedOutVouchers = async () => instance.get('api/private/vouchers/used-out');

export {
  getAllVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
  searchVoucher,
  filterExpiredVouchers,
  filterActiveVouchers,
  filterUsableVouchers,
  filterUsedOutVouchers,
};
