import axiosClient from './axios';

const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    try {
      const response = await axiosClient.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      const response = await axiosClient.post('/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axiosClient.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await axiosClient.post('/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUser: async () => {
    try {
      const response = await axiosClient.get('/api/user');
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCsrfCookie: async () => {
    try {
      const response = await axiosClient.get('/sanctum/csrf-cookie');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Alerts endpoints
  getAlerts: async () => {
    try {
      const response = await axiosClient.get('/alerts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createAlert: async (alertData) => {
    try {
      const response = await axiosClient.post('/alerts', alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAlert: async (id) => {
    try {
      const response = await axiosClient.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAlert: async (id, alertData) => {
    try {
      const response = await axiosClient.put(`/alerts/${id}`, alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteAlert: async (id) => {
    try {
      const response = await axiosClient.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAlertsCountretard: async () => {
    try {
      const response = await axiosClient.get('/nbralerts', {
        params: {
          alert_type: 'enretard'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAlertsCountpresquefinie: async () => {
    try {
      const response = await axiosClient.get('/nbralerts', {
        params: {
          alert_type: 'presquefinie'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  

  // Filiere endpoints
  getFilieres: async () => {
    try {
      const response = await axiosClient.get('/filieres');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  // Filiere endpoints avancement 
  // "topthree":"ok"
  getFilieresAvonment: async () => {
    try {
      const response = await axiosClient.get('/filieres', {
        params: {
          topthree: 'ok'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFilieresCount: async () => {
    try {
      const response = await axiosClient.get('/totalNbrFilieres');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Groupe endpoints
  getGroupesCount: async () => {
    try {
      const response = await axiosClient.get('/nbrgroupes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Avancement endpoints
  getAvancements: async () => {
    try {
      const response = await axiosClient.get('/index');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAvancement: async (groupe, module) => {
    try {
      const response = await axiosClient.get(`/avancements/${groupe}/${module}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateAvancement: async (id, data) => {
    try {
      const response = await axiosClient.put(`/avancements/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  storeAvancement: async (data) => {
    try {
      const response = await axiosClient.post('/store', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  calculateTauxAvancement: async () => {
    try {
      const response = await axiosClient.get('/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  changeNbHeures: async (data) => {
    try {
      const response = await axiosClient.put('/changerhoraires', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Users endpoint
  getUsers: async () => {
    try {
      const response = await axiosClient.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // General endpoints
  getCalendrierEfms: async (regional) => {
    try {
      const response = await axiosClient.get(`/calendrierefms/${regional || ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getEtatsModules: async () => {
    try {
      const response = await axiosClient.get('/etatsmodules');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getNotifications: async () => {
    try {
      const response = await axiosClient.get('/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  uploadStats: async (file,type) => {
    try {
      const formData = new FormData();
      formData.append('excelfile', file);
      formData.append('type', type);
      const response = await axiosClient.post('/uploadstats', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // utile si tu utilises Laravel Sanctum
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  truncateCustomTables: async () => {
    try {
      const response = await axiosClient.post('/api/truncate-custom-tables');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkProgressState: async () => {
    try {
      const response = await axiosClient.get('/checkProgress');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default apiService;