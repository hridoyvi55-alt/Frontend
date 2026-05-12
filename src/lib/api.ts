const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://realearn-api.onrender.com/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private token: string | null = null;
  private adminToken: string | null = null;
  private mockMode = true; // Enable mock mode when backend is not available

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  setAdminToken(token: string) {
    this.adminToken = token;
    localStorage.setItem('adminToken', token);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isAdmin = false
  ): Promise<ApiResponse<T>> {
    // If mock mode is enabled, return mock data for demo
    if (this.mockMode && !isAdmin) {
      return this.getMockResponse(endpoint, options);
    }

    const token = isAdmin ? this.adminToken : this.token;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(isAdmin ? { 'x-admin-password': token || '' } : {}),
      ...(token && !isAdmin ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Request failed' };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  // Mock data for demo mode
  private getMockResponse(endpoint: string, options: RequestInit): Promise<ApiResponse<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint === '/user/sync') {
          resolve({
            success: true,
            data: {
              user: {
                uid: 'demo-' + Date.now(),
                email: 'demo@realearn.app',
                displayName: 'Demo User',
                photoURL: null,
                balance: 50.00,
                totalEarnings: 150.00,
                withdrawableBalance: 50.00,
                referralCode: 'DEMO' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                referralCount: 3,
                referralEarnings: 6.00,
                tasksCompleted: { ads: 25, survey: 12, gameInstall: 8 },
                settings: { language: 'en', darkMode: true },
                isBlocked: false
              },
              token: 'mock-jwt-token-' + Date.now()
            }
          });
        } else if (endpoint === '/user/profile') {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          resolve({ success: true, data: { user } });
        } else if (endpoint === '/leaderboard') {
          resolve({
            success: true,
            data: {
              leaderboard: [
                { rank: 1, name: 'Sarah Khan', photoURL: null, totalEarnings: 2850.50, referralCount: 89 },
                { rank: 2, name: 'Ahmed Ali', photoURL: null, totalEarnings: 2340.25, referralCount: 67 },
                { rank: 3, name: 'Fatima Begum', photoURL: null, totalEarnings: 1890.00, referralCount: 54 },
                { rank: 4, name: 'Rashid Ahmed', photoURL: null, totalEarnings: 1560.75, referralCount: 42 },
                { rank: 5, name: 'Priya Sharma', photoURL: null, totalEarnings: 1230.00, referralCount: 38 },
                { rank: 6, name: 'Kamal Hossain', photoURL: null, totalEarnings: 980.50, referralCount: 29 },
                { rank: 7, name: 'Nadia Rahman', photoURL: null, totalEarnings: 750.25, referralCount: 21 },
                { rank: 8, name: 'Imran Khan', photoURL: null, totalEarnings: 520.00, referralCount: 15 },
                { rank: 9, name: 'Zara Islam', photoURL: null, totalEarnings: 380.75, referralCount: 12 },
                { rank: 10, name: 'Omar Hassan', photoURL: null, totalEarnings: 250.00, referralCount: 8 },
              ]
            }
          });
        } else if (endpoint.includes('/tasks/')) {
          const type = endpoint.split('/').pop();
          const tasks = {
            ads: [
              { _id: '1', type: 'ads', title: 'Watch 5 Ads Package', description: 'Complete 5 ad views to earn', reward: 0.70, requiredCount: 5, countdownSeconds: 30, platform: 'AdStellar', externalUrl: '' },
              { _id: '2', type: 'ads', title: 'Premium Ad Pack', description: 'Watch premium advertisements', reward: 1.20, requiredCount: 8, countdownSeconds: 45, platform: 'Monotag', externalUrl: '' },
            ],
            survey: [
              { _id: '3', type: 'survey', title: 'Quick Survey (3 questions)', description: 'Answer 3 quick questions', reward: 1.50, requiredCount: 3, countdownSeconds: 0, platform: 'SurveyMonkey', externalUrl: '' },
              { _id: '4', type: 'survey', title: 'Product Feedback Survey', description: 'Share your product experience', reward: 2.00, requiredCount: 5, countdownSeconds: 0, platform: 'Toluna', externalUrl: '' },
            ],
            gameInstall: [
              { _id: '5', type: 'gameInstall', title: 'Install & Play Game', description: 'Install game and reach level 3', reward: 3.00, requiredCount: 1, countdownSeconds: 0, platform: 'AppLovin', externalUrl: '' },
              { _id: '6', type: 'gameInstall', title: 'Game Trial Package', description: 'Play for 10 minutes', reward: 2.50, requiredCount: 1, countdownSeconds: 0, platform: 'Unity Ads', externalUrl: '' },
            ]
          };
          resolve({ success: true, data: { tasks: tasks[type as keyof typeof tasks] || [] } });
        } else if (endpoint === '/withdrawal/history') {
          resolve({
            success: true,
            data: {
              withdrawals: [
                { _id: '1', amount: 50, method: 'bkash', status: 'approved', createdAt: new Date().toISOString(), adminNote: '' },
                { _id: '2', amount: 25, method: 'nagad', status: 'paid', createdAt: new Date(Date.now() - 86400000).toISOString(), adminNote: '' },
                { _id: '3', amount: 100, method: 'paypal', status: 'pending', createdAt: new Date(Date.now() - 172800000).toISOString(), adminNote: '' },
              ]
            }
          });
        } else {
          resolve({ success: true, data: {} });
        }
      }, 500); // Simulate network delay
    });
  }

  // User endpoints
  async syncUser(user: { uid: string; email?: string; displayName?: string; photoURL?: string }) {
    return this.request<any>('/user/sync', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async getProfile() {
    return this.request<any>('/user/profile');
  }

  async updateProfile(data: { displayName?: string; photoURL?: string }) {
    return this.request<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateSettings(data: { language?: string; darkMode?: boolean }) {
    return this.request<any>('/user/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async processReferral(referralCode: string) {
    return this.request<any>('/referral/process', {
      method: 'POST',
      body: JSON.stringify({ referralCode }),
    });
  }

  async getTasks(type: 'ads' | 'survey' | 'gameInstall') {
    return this.request<any>(`/tasks/${type}`);
  }

  async completeTask(taskId: string, fingerprint: string) {
    return this.request<any>('/task/complete', {
      method: 'POST',
      body: JSON.stringify({ taskId, fingerprint }),
    });
  }

  async getLeaderboard() {
    return this.request<any>('/leaderboard');
  }

  async requestWithdrawal(data: {
    amount: number;
    method: 'bkash' | 'nagad' | 'paypal' | 'binance';
    paymentDetails: any;
    fingerprint?: string;
  }) {
    return this.request<any>('/withdrawal/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getWithdrawalHistory() {
    return this.request<any>('/withdrawal/history');
  }

  // Admin endpoints
  async adminLogin(password: string) {
    return this.request<any>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }, true);
  }

  async adminGetUsers(params?: { page?: number; limit?: number; search?: string }) {
    return this.request<any>(`/admin/users?${new URLSearchParams(params as any)}`, {}, true);
  }

  async adminBlockUser(uid: string, blocked: boolean) {
    return this.request<any>(`/admin/user/${uid}/block`, {
      method: 'POST',
      body: JSON.stringify({ blocked }),
    }, true);
  }

  async adminGetPendingWithdrawals() {
    return this.request<any>('/admin/withdrawals/pending', {}, true);
  }

  async adminProcessWithdrawal(id: string, status: 'approved' | 'rejected', note?: string) {
    return this.request<any>(`/admin/withdrawal/${id}/process`, {
      method: 'POST',
      body: JSON.stringify({ status, note }),
    }, true);
  }

  async adminGetWithdrawals(params?: { page?: number; limit?: number; status?: string }) {
    return this.request<any>(`/admin/withdrawals?${new URLSearchParams(params as any)}`, {}, true);
  }

  async adminCreateTask(data: any) {
    return this.request<any>('/admin/task', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true);
  }

  async adminGetFraudAlerts() {
    return this.request<any>('/admin/fraud-alerts', {}, true);
  }

  async adminGetStats() {
    return this.request<any>('/admin/stats', {}, true);
  }
}

export const api = new ApiService();
export default api;
