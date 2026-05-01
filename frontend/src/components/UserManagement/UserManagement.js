import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Shield, UserX } from 'lucide-react';
import UserService from '../../services/UserService';
import '../styles/UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('USER');
  const [filter, setFilter] = useState('ALL');

  const roles = ['USER', 'ADMIN', 'TECHNICIAN', 'MANAGER'];

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await UserService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await UserService.updateUserRole(userId, newRole);
      setEditingId(null);
      await loadUsers();
    } catch (err) {
      setError('Failed to update user role');
      console.error('Error updating role:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await UserService.deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const filteredUsers = filter === 'ALL' 
    ? users 
    : users.filter(u => u.role === filter);

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <p className="subtitle">Manage system users and their roles</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="user-management-controls">
        <div className="filter-controls">
          {['ALL', ...roles].map(role => (
            <button
              key={role}
              className={`filter-btn ${filter === role ? 'active' : ''}`}
              onClick={() => setFilter(role)}
            >
              {role}
              <span className="count">
                ({role === 'ALL' ? users.length : users.filter(u => u.role === role).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <UserX size={48} />
          <p>No users found</p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={`user-row role-${user.role.toLowerCase()}`}>
                  <td className="cell-name">{user.fullName}</td>
                  <td className="cell-email">{user.email}</td>
                  <td className="cell-role">
                    {editingId === user.id ? (
                      <select
                        className="role-select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`role-badge role-${user.role.toLowerCase()}`}>
                        <Shield size={14} />
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td className="cell-date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="cell-actions">
                    {editingId === user.id ? (
                      <div className="action-buttons">
                        <button
                          className="btn-save"
                          onClick={() => handleUpdateRole(user.id, selectedRole)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingId(user.id);
                            setSelectedRole(user.role);
                          }}
                          title="Edit user role"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
