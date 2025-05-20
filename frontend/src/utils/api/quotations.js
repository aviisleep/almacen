import  api  from './api';

export const getAllQuotations = () => api.get('/quotations');
export const getQuotationById = (id) => api.get(`/quotations/${id}`);
export const createQuotation = (data) => api.post('/quotations/', data);
export const updateQuotation = (id, data) => api.put(`/quotations/${id}`, data);
export const deleteQuotation = (id) => api.delete(`/quotations/${id}`);
export const getProductSuggestions = (query) => api.get(`/quotations/product-suggestions/${query}`);
export const getDashboardStats = () => api.get('/quotations/stats/dashboard');
export const searchQuotations = (params) => api.get('/quotations/search', { params });