import apiClient from './apiClient';

const NotificationService = {
  getMyNotifications: () => apiClient.get('/api/notifications'),
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`)
};

export default NotificationService;
