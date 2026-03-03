import axios from 'axios';

import * as dummy from './dummy-data';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsageStats = async () => {
  try {
    const response = await api.get('/usage/stats');
    return response.data;
  } catch (error) {
    console.warn('API /usage/stats failed, using dummy data', error.message);
    const usage = dummy.getUsageLogs()[dummy.getUsageLogs().length - 1];
    return {
      ...usage,
      apps: dummy.appBreakdown.apps,
      devices: dummy.getConnectedDevices(),
    };
  }
};

export const getWeeklyReport = async () => {
  try {
    const response = await api.get('/report/weekly');
    return response.data;
  } catch (error) {
    console.warn('API /report/weekly failed, using dummy data', error.message);
    return dummy.getUsageLogs();
  }
};

export const getRehabPlan = async () => {
  try {
    const response = await api.get('/rehab/plan');
    return response.data;
  } catch (error) {
    console.warn('API /rehab/plan failed, using dummy data', error.message);
    return dummy.getRehabPlan();
  }
};

export const getHeatMap = async () => {
  try {
    const response = await api.get('/usage/heatmap');
    return response.data;
  } catch (error) {
    console.warn('API /usage/heatmap failed, using dummy data', error.message);
    return dummy.getHeatMap();
  }
};

export const getChildStats = async (childId) => {
  try {
    const response = await api.get(`/monitor/${childId}/stats`);
    return response.data;
  } catch (error) {
    console.warn(`API /monitor/${childId}/stats failed, using dummy data`, error.message);
    return dummy.getUsageLogs()[0];
  }
};

export default api;
