import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      
      const response = await api.post('/auth/login', { 
        username: username.trim(), 
        password 
      });
      
      console.log('Login response:', response.data);
      
      const { token, username: userName } = response.data;
      
      if (!token) {
        return { success: false, error: 'Токен не получен от сервера' };
      }
      
      // Сохраняем токен
      localStorage.setItem('token', token);
      
      // Обновляем состояние
      set({ 
        token, 
        isAuthenticated: true, 
        user: { username: userName } 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Ошибка входа';
      
      return { success: false, error: errorMessage };
    }
  },
  
  register: async (username, password, email) => {
    try {
      console.log('Attempting registration for:', username);
      
      await api.post('/auth/register', { 
        username: username.trim(), 
        password, 
        email: email?.trim() 
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.message 
        || error.message 
        || 'Ошибка регистрации';
      
      return { success: false, error: errorMessage };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }
    
    try {
      const response = await api.get('/auth/me');
      set({ 
        isAuthenticated: true, 
        user: response.data,
        token 
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null, token: null });
    }
  },
}));