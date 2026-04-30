import apiClient from './apiClient';

const API_BASE_URL = '/api/bookings';

const BookingService = {
  createBooking: (bookingData) => {
    return apiClient.post(API_BASE_URL, bookingData);
  },

  getAllBookings: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.requestedBy) params.append('requestedBy', filters.requestedBy);
    if (filters.resourceType) params.append('resourceType', filters.resourceType);
    if (filters.resourceName) params.append('resourceName', filters.resourceName);

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`${API_BASE_URL}${query}`);
  },

  getBookingById: (id) => {
    return apiClient.get(`${API_BASE_URL}/${id}`);
  },

  getBookingByBookingId: (bookingId) => {
    return apiClient.get(`${API_BASE_URL}/booking/${bookingId}`);
  },

  updateBooking: (id, bookingData) => {
    return apiClient.put(`${API_BASE_URL}/${id}`, bookingData);
  },

  updateBookingStatus: (id, payload) => {
    return apiClient.put(`${API_BASE_URL}/${id}/status`, payload);
  },

  deleteBooking: (id) => {
    return apiClient.delete(`${API_BASE_URL}/${id}`);
  },

  checkAvailability: (resourceName, bookingDate, startTime, endTime) => {
    const params = new URLSearchParams();
    params.append('resourceName', resourceName);
    params.append('bookingDate', bookingDate);
    params.append('startTime', startTime);
    params.append('endTime', endTime);
    return apiClient.get(`${API_BASE_URL}/check-availability?${params.toString()}`);
  }
};

export default BookingService;
