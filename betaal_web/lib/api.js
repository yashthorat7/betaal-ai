import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsageStats = async () => {
  const response = await api.get('/usage/stats');
  return response.data;
};

export const getWeeklyReport = async () => {
  const response = await api.get('/report/weekly');
  return response.data;
};

export const getRehabPlan = async () => {
  const response = await api.get('/rehab/plan');
  return response.data;
};

export const getHeatMap = async () => {
  const response = await api.get('/usage/heatmap');
  return response.data;
};

export const getChildStats = async (childId) => {
  const response = await api.get(`/monitor/${childId}/stats`);
  return response.data;
};

export default api;
