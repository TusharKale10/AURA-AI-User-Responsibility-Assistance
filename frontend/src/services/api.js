import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aura_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aura_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const tasksApi = {
  getAll: (params) => api.get('/tasks', { params }),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export const dashboardApi = {
  get: () => api.get('/dashboard'),
};

export const aiApi = {
  planner: (goal) => api.post('/ai/planner', { goal }),
  reflection: () => api.post('/ai/reflection'),
  mission: () => api.get('/ai/mission'),
};

export const goalsApi = {
  getAll: () => api.get('/goals'),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  addMilestone: (id, data) => api.post(`/goals/${id}/milestones`, data),
  toggleMilestone: (id, milestoneId) => api.patch(`/goals/${id}/milestones/${milestoneId}/toggle`),
  deleteMilestone: (id, milestoneId) => api.delete(`/goals/${id}/milestones/${milestoneId}`),
  getConflicts: () => api.get('/goals/conflicts'),
  getHeatmap: (id) => api.get(`/goals/${id}/heatmap`),
};

export const dnaApi = {
  get: () => api.get('/dna'),
  refresh: () => api.post('/dna/refresh'),
};

export const decisionApi = {
  getTasks: () => api.get('/decision/tasks'),
  analyze: (data) => api.post('/decision/analyze', data),
};

export const knowledgeApi = {
  getAll: (params) => api.get('/knowledge', { params }),
  generate: (data) => api.post('/knowledge/generate', data),
  convertToTask: (data) => api.post('/knowledge/convert-to-task', data),
  delete: (id) => api.delete(`/knowledge/${id}`),
};

export const lifeBalanceApi = {
  get: () => api.get('/life-balance'),
  recalculate: () => api.post('/life-balance/recalculate'),
  getHistory: () => api.get('/life-balance/history'),
};

export const adaptiveApi = {
  getPlan: () => api.get('/adaptive/plan'),
  reschedule: (data) => api.post('/adaptive/reschedule', data),
};

export const analyticsApi = {
  getOverview: () => api.get('/analytics/overview'),
  getTrends: () => api.get('/analytics/trends'),
  getProductivity: () => api.get('/analytics/productivity'),
  generateReport: () => api.post('/analytics/generate-report'),
};

export default api;
