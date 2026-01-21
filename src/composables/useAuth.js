import { ref, computed } from 'vue';
import { authAPI } from '../services/authService';

const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const setUser = (newUser) => {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const login = async (email, password) => {
    const result = await authAPI.login(email, password);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const register = async (email, password, name) => {
    const result = await authAPI.register(email, password, name);
    setToken(result.token);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    try {
      if (token.value) {
        await authAPI.logout(token.value);
      }
    } catch (error) {
      // Ignore logout errors and clear client state regardless.
      console.error('Logout error:', error);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
}
