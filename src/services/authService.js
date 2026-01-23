const API_BASE_URL = 'http://localhost:5000/api';

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  },

  register: async (email, password, name, role = 'user') => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Logout failed');
    }

    return await response.json();
  },

  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return await response.json();
  },

  fetchProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return await response.json();
  },

  updateProfile: async (token, profileData) => {
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`,
    };

    // Check if profileData is FormData (for file upload) or regular object
    if (profileData instanceof FormData) {
      body = profileData;
      // Don't set Content-Type header for FormData; browser will set it with proper boundary
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(profileData);
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
  },

  updatePassword: async (token, passwordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update password');
    }

    return await response.json();
  },
};

export const usersAPI = {
  getAvailableRoles: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }

    return await response.json();
  },

  getAllUsers: async (token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }

    return await response.json();
  },

  getUserById: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }

    return await response.json();
  },

  createUser: async (token, userData) => {
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`,
    };

    // Check if userData is FormData (for file upload)
    if (userData instanceof FormData) {
      body = userData;
      // Don't set Content-Type header for FormData; browser will set it with proper boundary
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(userData);
    }

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  },

  updateUser: async (token, id, userData) => {
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`,
    };

    // Check if userData is FormData (for file upload)
    if (userData instanceof FormData) {
      body = userData;
      // Don't set Content-Type header for FormData; browser will set it with proper boundary
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(userData);
    }

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return await response.json();
  },

  deleteUser: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }

    return await response.json();
  },
};

export const rolesAPI = {
  getAllRoles: async (token) => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch roles');
    }

    return await response.json();
  },

  getActiveRoles: async (token) => {
    const response = await fetch(`${API_BASE_URL}/roles/active`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch active roles');
    }

    return await response.json();
  },

  getRoleById: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch role');
    }

    return await response.json();
  },

  createRole: async (token, roleData) => {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create role');
    }

    return await response.json();
  },

  updateRole: async (token, id, roleData) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update role');
    }

    return await response.json();
  },

  deleteRole: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete role');
    }

    return await response.json();
  },
};

export const modulesAPI = {
  getAllModules: async (token) => {
    const response = await fetch(`${API_BASE_URL}/modules`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch modules');
    }

    return await response.json();
  },

  getActiveModules: async (token) => {
    const response = await fetch(`${API_BASE_URL}/modules/active/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch active modules');
    }

    return await response.json();
  },

  getModuleById: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch module');
    }

    return await response.json();
  },

  createModule: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create module');
    }

    return await response.json();
  },

  updateModule: async (token, id, data) => {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update module');
    }

    return await response.json();
  },

  deleteModule: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete module');
    }

    return await response.json();
  },
};

export const permissionsAPI = {
  getAllPermissions: async (token) => {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch permissions');
    }

    return await response.json();
  },

  getPermissionsByModule: async (token, moduleId) => {
    const response = await fetch(`${API_BASE_URL}/permissions/module/${moduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch permissions');
    }

    return await response.json();
  },

  getPermissionById: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/permissions/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch permission');
    }

    return await response.json();
  },

  createPermission: async (token, data) => {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create permission');
    }

    return await response.json();
  },

  updatePermission: async (token, id, data) => {
    const response = await fetch(`${API_BASE_URL}/permissions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update permission');
    }

    return await response.json();
  },

  deletePermission: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/permissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete permission');
    }

    return await response.json();
  },
};

export const categoriesAPI = {
  getAllCategories: async (token) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch categories');
    }

    return await response.json();
  },

  getCategoryById: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch category');
    }

    return await response.json();
  },

  createCategory: async (token, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    return await response.json();
  },

  updateCategory: async (token, id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }

    return await response.json();
  },

  deleteCategory: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }

    return await response.json();
  },
};