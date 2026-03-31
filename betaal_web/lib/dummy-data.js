// Dummy data based on api_and_data.md for Betaal AI Hackathon demo

export const userProfile = {
  uid: 'demo_user_001',
  name: 'Divesh',
  age: 19,
  email: 'diveshpatil9104@gmail.com',
  avatar_url: null,
  addiction_level: 8,
  strictness: 3,
  created_at: '2025-01-01T00:00:00Z',
  linked_parent_id: 'demo_parent_001',
  stealth_icon: 'default',
  stealth_name: 'Betaal AI',
};

export const parentProfile = {
  uid: 'demo_parent_001',
  name: 'Sunita',
  age: 45,
  email: 'sunita.demo@gmail.com',
  linked_children: ['demo_user_001'],
};

export const rehabPlan = {
  uid: 'demo_user_001',
  duration_days: 24,
  start_date: '2025-01-01',
  current_phase: 2,
  current_day: 8,
  phases: [
    { phase: 1, name: 'Awareness', start_day: 1, end_day: 5, daily_quota_min: 378, intensity: 0.2 },
    {
      phase: 2,
      name: 'Reduction',
      start_day: 6,
      end_day: 12,
      daily_quota_min: 273,
      intensity: 0.5,
    },
    {
      phase: 3,
      name: 'Discipline',
      start_day: 13,
      end_day: 19,
      daily_quota_min: 168,
      intensity: 0.8,
    },
    { phase: 4, name: 'Freedom', start_day: 20, end_day: 24, daily_quota_min: 84, intensity: 0.5 },
  ],
  last_recalculated: '2025-01-01T00:00:00Z',
};

export const usageLogs = [
  { date: '2025-01-01', total_min: 420, unlocks: 78, top_app: 'Instagram', under_quota: false },
  { date: '2025-01-02', total_min: 405, unlocks: 72, top_app: 'YouTube', under_quota: false },
  { date: '2025-01-03', total_min: 390, unlocks: 65, top_app: 'Instagram', under_quota: false },
  { date: '2025-01-04', total_min: 410, unlocks: 70, top_app: 'TikTok', under_quota: false },
  { date: '2025-01-05', total_min: 370, unlocks: 60, top_app: 'YouTube', under_quota: true },
  { date: '2025-01-06', total_min: 340, unlocks: 55, top_app: 'Instagram', under_quota: false },
  { date: '2025-01-07', total_min: 310, unlocks: 48, top_app: 'YouTube', under_quota: false },
  { date: '2025-01-08', total_min: 285, unlocks: 42, top_app: 'Instagram', under_quota: false },
  { date: '2025-01-09', total_min: 260, unlocks: 38, top_app: 'WhatsApp', under_quota: true },
  { date: '2025-01-10', total_min: 240, unlocks: 35, top_app: 'YouTube', under_quota: true },
  { date: '2025-01-11', total_min: 255, unlocks: 40, top_app: 'TikTok', under_quota: true },
  { date: '2025-01-12', total_min: 220, unlocks: 30, top_app: 'Instagram', under_quota: true },
  { date: '2025-01-13', total_min: 200, unlocks: 28, top_app: 'YouTube', under_quota: false },
  { date: '2025-01-14', total_min: 185, unlocks: 25, top_app: 'WhatsApp', under_quota: true },
  { date: '2025-01-15', total_min: 170, unlocks: 22, top_app: 'Instagram', under_quota: true },
  { date: '2025-01-16', total_min: 165, unlocks: 20, top_app: 'Twitter', under_quota: true },
  { date: '2025-01-17', total_min: 150, unlocks: 18, top_app: 'Reddit', under_quota: true },
];

export const appBreakdown = {
  date: '2025-01-14',
  apps: [
    { app_name: 'Instagram', category: 'social', minutes: 52 },
    { app_name: 'YouTube', category: 'entertainment', minutes: 45 },
    { app_name: 'WhatsApp', category: 'messaging', minutes: 38 },
    { app_name: 'BGMI', category: 'gaming', minutes: 28 },
    { app_name: 'Chrome', category: 'browser', minutes: 22 },
    { app_name: 'Reddit', category: 'social', minutes: 18 },
    { app_name: 'Spotify', category: 'music', minutes: 12 },
    { app_name: 'Twitter', category: 'social', minutes: 10 },
  ],
};

export const connectedDevices = [
  {
    device_id: 'phone_001',
    name: "Divesh's Phone",
    type: 'phone',
    status: 'active',
    today_min: 185,
  },
  {
    device_id: 'laptop_001',
    name: "Divesh's Laptop",
    type: 'laptop',
    status: 'active',
    today_min: 63,
  },
  {
    device_id: 'phone_002',
    name: "Child's Phone",
    type: 'phone',
    status: 'active',
    today_min: 225,
  },
];

export const heatMapData = {
  weeks: [
    [420, 405, 390, 410, 370, 340, 310],
    [285, 260, 240, 255, 220, 200, 185],
    [175, 160, 150, 165, 140, 130, 120],
    [115, 105, 100, 110, 95, 90, 85],
  ],
};

// ====== Chat Fallback ====== //
export const chatResponse = "Great progress! You're under your limit today. Keep focusing on reducing Instagram. Try replacing 15 minutes of scrolling with a short walk today. Remember, small consistent changes lead to lasting habits.";

// ====== AI Risk Evaluation Fallback ====== //
export const riskEvaluation = {
  classification: 'Moderate Risk',
  score: 65,
  details: 'Screen time is dropping generally, but late-night usage remains consistently high across Instagram and YouTube.',
  suggested_actions: [
    'Enable Wind Down mode by 10 PM',
    'Increase interruption strictness in the evening',
  ],
};

// ====== YouTube Recommendations Fallback ====== //
export const youtubeRecommendations = [
  { title: 'How to Build Laser Focus', url: 'https://www.youtube.com/watch?v=AUoVn4sEGnM', thumbnail: 'https://img.youtube.com/vi/AUoVn4sEGnM/mqdefault.jpg', channel: 'Productivity Game' },
  { title: 'Quit Social Media – Your Brain Will Thank You', url: 'https://www.youtube.com/watch?v=iONDebHX9qk', thumbnail: 'https://img.youtube.com/vi/iONDebHX9qk/mqdefault.jpg', channel: 'Dr. Cal Newport' },
  { title: 'Digital Minimalism – Full Audiobook Summary', url: 'https://www.youtube.com/watch?v=0K5OO2ybueM', thumbnail: 'https://img.youtube.com/vi/0K5OO2ybueM/mqdefault.jpg', channel: 'Escaping Ordinary' },
  { title: 'How I Broke My Phone Addiction', url: 'https://www.youtube.com/watch?v=3E7hkPZ-HTk', thumbnail: 'https://img.youtube.com/vi/3E7hkPZ-HTk/mqdefault.jpg', channel: "Matt D'Avella" },
];

// ====== Dashboard Fallback ====== //
export const dashboardData = {
  user_stats: { today_min: 185, limit_min: 273, top_app: 'Instagram' },
  extension_stats: { browser_min: 63, limit_min: 120 },
  linked_profiles: [{ name: 'Child Profile', today_min: 225, limit_min: 300 }],
};

// ====== Features List Fallback ====== //
export const featuresList = [
  { name: 'AI Chat', status: 'enabled', version: '1.0' },
  { name: 'YouTube Recommendations', status: 'enabled', version: '1.0' },
  { name: 'Parental Monitoring', status: 'enabled', version: '1.1' },
];

// ====== Daily Report Fallback ====== //
export const dailyReport = {
  date: '2025-01-14',
  total_min: 185,
  unlocks: 25,
  top_app: 'WhatsApp',
  under_quota: true,
};

// Export functions to simulate API calls
export const getUser = () => userProfile;
export const getParent = () => parentProfile;
export const getRehabPlan = () => rehabPlan;
export const getUsageLogs = () => usageLogs;
export const getAppBreakdown = () => appBreakdown;
export const getConnectedDevices = () => connectedDevices;
export const getHeatMap = () => heatMapData;
