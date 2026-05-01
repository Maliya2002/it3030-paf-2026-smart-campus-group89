import apiClient from './apiClient';

const UserService = {
  // GET endpoints
  getAllUsers: () => apiClient.get('/api/users'),

  getUserById: (id) => apiClient.get(`/api/users/${id}`),

  getUserByEmail: (email) => apiClient.get(`/api/users/email/${email}`),

  getUsersByRole: (role) => apiClient.get(`/api/users/role/${role}`),

  // PUT endpoints
  updateUserRole: (id, role) =>
    apiClient.put(`/api/users/${id}/role`, { role }),

  // DELETE endpoints
  deleteUser: (id) => apiClient.delete(`/api/users/${id}`)
};

export default UserService;
