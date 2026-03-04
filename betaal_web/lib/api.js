import axios from 'axios';

import * as dummy from './dummy-data';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper: get the current uid from localStorage or use demo fallback
const getUid = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('betaal_uid') || 'demo_user_001';
  }
  return 'demo_user_001';
};

// ====== USAGE ====== //

export const getUsageStats = async () => {
  try {
    const response = await api.get('/usage/stats', { params: { uid: getUid() } });
    const data = response.data;
    // Normalize: backend returns {today: {total_min, unlocks, ...}, top_apps: [...]}
    // but dashboard expects {total_min, unlocks, apps: [...], devices: [...]}
    if (data && data.today) {
      return {
        ...data.today,
        apps: (data.top_apps || []).map(a => ({ app_name: a.app_name, minutes: a.minutes, category: a.category || 'General' })),
        devices: dummy.getConnectedDevices(),
      };
    }
    return data;
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
    const response = await api.get('/report/weekly', { params: { uid: getUid() } });
    const data = response.data;
    // Normalize: backend returns {daily_totals: [285,260,...]} but we need an array of objects
    if (data && Array.isArray(data.daily_totals)) {
      const weekStart = data.week_start || '2025-01-08';
      return data.daily_totals.map((min, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return { date: d.toISOString().split('T')[0], total_min: min };
      });
    }
    if (Array.isArray(data)) return data;
    return dummy.getUsageLogs();
  } catch (error) {
    console.warn('API /report/weekly failed, using dummy data', error.message);
    return dummy.getUsageLogs();
  }
};

export const getRehabPlan = async () => {
  try {
    const response = await api.get('/rehab/plan', { params: { uid: getUid() } });
    return response.data;
  } catch (error) {
    console.warn('API /rehab/plan failed, using dummy data', error.message);
    return dummy.getRehabPlan();
  }
};

export const getHeatMap = async () => {
  try {
    const response = await api.get('/usage/heatmap', { params: { uid: getUid() } });
    const data = response.data;
    // Normalize: backend may return {matrix: [...]} but components expect {weeks: [...]}
    if (data && !data.weeks && data.matrix) {
      return { weeks: data.matrix };
    }
    return data;
  } catch (error) {
    console.warn('API /usage/heatmap failed, using dummy data', error.message);
    return dummy.getHeatMap();
  }
};

export const getUsageSummary = async () => {
  try {
    const response = await api.get('/usage/summary', { params: { uid: getUid() } });
    return response.data;
  } catch (error) {
    console.warn('API /usage/summary failed, using dummy data', error.message);
    return null;
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

export const getDailyReport = async () => {
  try {
    const response = await api.get('/report/daily', { params: { uid: getUid() } });
    return response.data;
  } catch (error) {
    console.warn('API /report/daily failed, using dummy data', error.message);
    return dummy.dailyReport;
  }
};

// ====== CHAT & AI ====== //

export const sendChatMessage = async (message, sessionId) => {
  try {
    const response = await api.post('/chat', {
      uid: getUid(),
      message,
      session_id: sessionId || `sess_${Date.now()}`,
    });
    return response.data;
  } catch (error) {
    console.warn('API /chat failed, using dummy data', error.message);
    return {
      response: dummy.chatResponse,
      session_id: sessionId || `sess_${Date.now()}`,
    };
  }
};

export const evaluateRisk = async () => {
  try {
    const response = await api.post('/ai/evaluate', { uid: getUid() });
    return response.data;
  } catch (error) {
    console.warn('API /ai/evaluate failed, using dummy data', error.message);
    return dummy.riskEvaluation;
  }
};

export const getYoutubeRecommendations = async (prompt, topics, keywords) => {
  try {
    const response = await api.post('/youtube/recommend', {
      uid: getUid(),
      prompt: prompt || 'productivity',
      topics: topics || ['focus', 'digital wellness'],
      keywords: keywords || ['screen time', 'addiction'],
    });
    return response.data;
  } catch (error) {
    console.warn('API /youtube/recommend failed, using dummy data', error.message);
    return { videos: dummy.youtubeRecommendations };
  }
};

// ====== USER PROFILE ====== //

export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile', { params: { uid: getUid() } });
    return response.data;
  } catch (error) {
    console.warn('API /user/profile failed, using dummy data', error.message);
    return dummy.userProfile;
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await api.put('/user/profile', { uid: getUid(), ...data });
    return response.data;
  } catch (error) {
    console.warn('API /user/profile PUT failed, using dummy data', error.message);
    return { status: 'updated', uid: getUid() };
  }
};

// ====== DASHBOARD & FEATURES ====== //

export const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard', { params: { uid: getUid() } });
    return response.data;
  } catch (error) {
    console.warn('API /dashboard failed, using dummy data', error.message);
    return dummy.dashboardData;
  }
};

export const getFeatures = async () => {
  try {
    const response = await api.get('/features');
    return response.data;
  } catch (error) {
    console.warn('API /features failed, using dummy data', error.message);
    return { active_features: dummy.featuresList };
  }
};

// ====== MONITORING ====== //

export const updateStrictness = async (childId, parentUid, newStrictness) => {
  try {
    const response = await api.put(`/monitor/${childId}/strictness`, {
      parent_uid: parentUid || getUid(),
      new_strictness: newStrictness,
    });
    return response.data;
  } catch (error) {
    console.warn('API /monitor/strictness failed, using dummy data', error.message);
    return { status: 'updated', new_strictness: newStrictness, new_duration_days: 14 };
  }
};

// ====== AUTH ====== //

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (typeof window !== 'undefined' && response.data?.uid) {
      localStorage.setItem('betaal_uid', response.data.uid);
      localStorage.setItem('betaal_session', response.data.session_token);
    }
    return response.data;
  } catch (error) {
    console.warn('API /auth/login failed, using demo fallback', error.message);
    if (typeof window !== 'undefined') {
      localStorage.setItem('betaal_uid', 'demo_user_001');
      localStorage.setItem('betaal_session', 'sess_demo');
    }
    return { uid: 'demo_user_001', session_token: 'sess_demo', message: 'Demo login (offline)' };
  }
};

export const logoutUser = async () => {
  try {
    const uid = getUid();
    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('betaal_session') || '' : '';
    await api.post('/auth/logout', { uid, session_token: sessionToken });
  } catch (error) {
    console.warn('API /auth/logout failed', error.message);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('betaal_uid');
      localStorage.removeItem('betaal_session');
    }
  }
  return { status: 'success', message: 'Logged out' };
};

export default api;

