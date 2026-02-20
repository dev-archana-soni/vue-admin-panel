import { ref, computed } from 'vue';
import { authAPI } from '../services/authService';

const token = ref(localStorage.getItem('token') || null);
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const sessionChecked = ref(false);

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
    sessionChecked.value = true;
    return result;
  };

  const register = async (email, password, name) => {
    const result = await authAPI.register(email, password, name);
    setToken(result.token);
    setUser(result.user);
    sessionChecked.value = true;
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
      sessionChecked.value = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const ensureSession = async () => {
    if (!token.value) {
      sessionChecked.value = true;
      return false;
    }

    if (sessionChecked.value) {
      return true;
    }

    try {
      const result = await authAPI.getProfile(token.value);
      if (result?.user) {
        setUser(result.user);
      }
      sessionChecked.value = true;
      return true;
    } catch (error) {
      await logout();
      sessionChecked.value = true;
      return false;
    }
  };

  const setAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    sessionChecked.value = true;
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    sessionChecked.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getProfile = async () => {
    if (!token.value) {
      throw new Error('Not authenticated');
    }
    return await authAPI.fetchProfile(token.value);
  };

  const updateProfile = async (profileData) => {
    if (!token.value) {
      throw new Error('Not authenticated');
    }
    const result = await authAPI.updateProfile(token.value, profileData);
    if (result?.user) {
      setUser(result.user);
    }
    return result;
  };

  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (!token.value) {
      throw new Error('Not authenticated');
    }
    return await authAPI.updatePassword(token.value, {
      currentPassword,
      newPassword,
      confirmPassword
    });
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    ensureSession,
    setAuth,
    clearAuth,
    getProfile,
    updateProfile,
    updatePassword,
  };
}
