import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/bookings';

const BookingService = {
  createBooking: (bookingData) => {
    return axios.post(API_BASE_URL, bookingData);
  },

  getAllBookings: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.requestedBy) params.append('requestedBy', filters.requestedBy);
    if (filters.resourceType) params.append('resourceType', filters.resourceType);
    if (filters.resourceName) params.append('resourceName', filters.resourceName);

    const query = params.toString() ? `?${params.toString()}` : '';
    return axios.get(`${API_BASE_URL}${query}`);
  },

  getBookingById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  getBookingByBookingId: (bookingId) => {
    return axios.get(`${API_BASE_URL}/booking/${bookingId}`);
  },

  updateBooking: (id, bookingData) => {
    return axios.put(`${API_BASE_URL}/${id}`, bookingData);
  },

  updateBookingStatus: (id, status, approvedBy) => {
    const params = new URLSearchParams();
    params.append('status', status);
    if (approvedBy) params.append('approvedBy', approvedBy);
    return axios.put(`${API_BASE_URL}/${id}/status?${params.toString()}`);
  },

  deleteBooking: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },

  checkAvailability: (resourceName, bookingDate, startTime, endTime) => {
    const params = new URLSearchParams();
    params.append('resourceName', resourceName);
    params.append('bookingDate', bookingDate);
    params.append('startTime', startTime);
    params.append('endTime', endTime);
    return axios.get(`${API_BASE_URL}/check-availability?${params.toString()}`);
  }
};

export default BookingService;
