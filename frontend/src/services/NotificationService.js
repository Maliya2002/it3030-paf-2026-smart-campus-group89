import apiClient from './apiClient';

const NotificationService = {
  // GET endpoints
  getMyNotifications: (type) => {
    if (type) {
      return apiClient.get(`/api/notifications?type=${type}`);
    }
    return apiClient.get('/api/notifications');
  },

  getUnreadNotifications: () => apiClient.get('/api/notifications/unread'),

  getUnreadCount: () => apiClient.get('/api/notifications/unread/count'),

  getNotificationById: (id) => apiClient.get(`/api/notifications/${id}`),

  // PATCH endpoints
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),

  markAllAsRead: () => apiClient.patch('/api/notifications/mark-all-read'),

  // DELETE endpoints
  deleteNotification: (id) => apiClient.delete(`/api/notifications/${id}`),

  deleteAllNotifications: () => apiClient.delete('/api/notifications')
};

export default NotificationService;

