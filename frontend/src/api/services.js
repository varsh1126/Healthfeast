import { apiRequest } from './client';

export const authService = {
  login: (username, password) =>
    apiRequest('/api/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (userData) =>
    apiRequest('/api/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => apiRequest('/api/auth/me/'),
};

export const profileService = {
  getProfile: () => apiRequest('/api/profile/'),
  updateProfile: (data) =>
    apiRequest('/api/profile/update/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const healthService = {
  analyzeHealth: (params = {}) =>
    apiRequest('/api/health/analyze/', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  getTargets: () => apiRequest('/api/nutrition/targets/'),
};

export const foodService = {
  listFoods: (params = '') => apiRequest(`/api/foods/${params ? '?' + params : ''}`),
  searchFoods: (query) => apiRequest(`/api/foods/search/?q=${encodeURIComponent(query)}`),
};

export const dietService = {
  generatePlan: () =>
    apiRequest('/api/diet/generate/', {
      method: 'POST',
    }),

  getActivePlan: () => apiRequest('/api/diet/weekly/'),

  getMealReplacements: (mealId) =>
    apiRequest(`/api/diet/meal/${mealId}/replace/`, {
      method: 'POST',
    }),

  applyMealReplacement: (mealId, foodId, portionMultiplier = 1.0) =>
    apiRequest(`/api/diet/meal/${mealId}/apply-replace/`, {
      method: 'POST',
      body: JSON.stringify({ food_id: foodId, portion_multiplier: portionMultiplier }),
    }),

  updateMealStatus: (mealId, action) =>
    apiRequest(`/api/diet/meal/${mealId}/status/`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    }),

  matchPantry: (ingredients, maxBudget = null) =>
    apiRequest('/api/diet/pantry-match/', {
      method: 'POST',
      body: JSON.stringify({ ingredients, max_budget: maxBudget }),
    }),
};

export const scannerService = {
  scanImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiRequest('/api/scanner/analyze/', {
      method: 'POST',
      body: formData,
    });
  },
};

export const aiService = {
  chat: (query, history = []) =>
    apiRequest('/api/ai/chat/', {
      method: 'POST',
      body: JSON.stringify({ query, history }),
    }),
};

export const wellnessService = {
  getSkinWellness: () => apiRequest('/api/wellness/skin/'),
  calculateSkinScore: (params) =>
    apiRequest('/api/wellness/skin/', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};

export const trackingService = {
  getMeals: () => apiRequest('/api/tracking/meals/'),
  logMeal: (data) =>
    apiRequest('/api/tracking/meals/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getWater: () => apiRequest('/api/tracking/water/'),
  logWater: (amountMl) =>
    apiRequest('/api/tracking/water/', {
      method: 'POST',
      body: JSON.stringify({ amount_ml: amountMl }),
    }),

  getExercise: () => apiRequest('/api/tracking/exercise/'),
  logExercise: (data) =>
    apiRequest('/api/tracking/exercise/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSleep: () => apiRequest('/api/tracking/sleep/'),
  logSleep: (data) =>
    apiRequest('/api/tracking/sleep/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProgress: () => apiRequest('/api/tracking/progress/'),
  logProgress: (data) =>
    apiRequest('/api/tracking/progress/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const groceryService = {
  getGroceryList: () => apiRequest('/api/grocery/generate/'),
  updateGroceryList: (items) =>
    apiRequest('/api/grocery/generate/', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
};

export const adaptiveService = {
  getWeeklyReview: () => apiRequest('/api/adaptive/review/'),
  submitFeedback: (data) =>
    apiRequest('/api/feedback/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const adminService = {
  getMetrics: () => apiRequest('/api/admin/metrics/'),
};
