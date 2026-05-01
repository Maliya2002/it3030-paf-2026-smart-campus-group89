<<<<<<< HEAD
import api from './api';
=======
import apiClient from './apiClient';

const API_BASE_URL = '/api/tickets';
>>>>>>> main

const TicketService = {
  // Ticket CRUD Operations
  createTicket: (ticketData) => {
<<<<<<< HEAD
    return api.post('/tickets', ticketData);
=======
    return apiClient.post(API_BASE_URL, ticketData);
>>>>>>> main
  },

  getAllTickets: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTechnician) params.append('assignedTechnician', filters.assignedTechnician);
    if (filters.category) params.append('category', filters.category);
    if (filters.reportedBy) params.append('reportedBy', filters.reportedBy);

    const query = params.toString() ? `?${params.toString()}` : '';
<<<<<<< HEAD
    return api.get(`/tickets${query}`);
  },

  getTicketById: (id) => {
    return api.get(`/tickets/${id}`);
  },

  updateTicket: (id, ticketData, files = null) => {
    const formData = new FormData();
    formData.append('ticketData', JSON.stringify(ticketData));

    if (files) {
      files.forEach(file => formData.append('files', file));
    }

    return api.put(`/tickets/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteTicket: (id) => {
    return api.delete(`/tickets/${id}`);
=======
    return apiClient.get(`${API_BASE_URL}${query}`);
  },

  getTicketById: (id) => {
    return apiClient.get(`${API_BASE_URL}/${id}`);
  },

  updateTicket: (id, ticketData, files = null) => {
    return apiClient.put(`${API_BASE_URL}/${id}`, ticketData);
  },

  deleteTicket: (id) => {
    return apiClient.delete(`${API_BASE_URL}/${id}`);
>>>>>>> main
  },

  // Comment Operations
  addComment: (ticketId, commentData) => {
<<<<<<< HEAD
    return api.post(`/tickets/${ticketId}/comments`, commentData);
  },

  getComments: (ticketId) => {
    return api.get(`/tickets/${ticketId}/comments`);
  },

  editComment: (ticketId, commentId, commentData) => {
    return api.put(`/tickets/${ticketId}/comments/${commentId}`, commentData);
  },

  deleteComment: (ticketId, commentId, commentedBy) => {
    return api.delete(`/tickets/${ticketId}/comments/${commentId}?commentedBy=${commentedBy}`);
=======
    return apiClient.post(`${API_BASE_URL}/${ticketId}/comments`, commentData);
  },

  getComments: (ticketId) => {
    return apiClient.get(`${API_BASE_URL}/${ticketId}/comments`);
  },

  editComment: (ticketId, commentId, commentData) => {
    return apiClient.put(`${API_BASE_URL}/${ticketId}/comments/${commentId}`, commentData);
  },

  deleteComment: (ticketId, commentId, commentedBy) => {
    return apiClient.delete(`${API_BASE_URL}/${ticketId}/comments/${commentId}?commentedBy=${commentedBy}`);
>>>>>>> main
  },

  // Attachment Operations
  uploadAttachments: (ticketId, files, uploadedBy) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('uploadedBy', uploadedBy);
<<<<<<< HEAD

    return api.post(`/tickets/${ticketId}/attachments`, formData, {
=======
    
    return apiClient.post(`${API_BASE_URL}/${ticketId}/attachments`, formData, {
>>>>>>> main
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getAttachments: (ticketId) => {
<<<<<<< HEAD
    return api.get(`/tickets/${ticketId}/attachments`);
  },

  deleteAttachment: (ticketId, attachmentId) => {
    return api.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
  },

  downloadAttachment: (filename) => {
    return api.get(`/tickets/uploads/${filename}`, {
=======
    return apiClient.get(`${API_BASE_URL}/${ticketId}/attachments`);
  },

  deleteAttachment: (ticketId, attachmentId) => {
    return apiClient.delete(`${API_BASE_URL}/${ticketId}/attachments/${attachmentId}`);
  },

  downloadAttachment: (filename) => {
    return apiClient.get(`${API_BASE_URL}/uploads/${filename}`, {
>>>>>>> main
      responseType: 'blob'
    });
  }
};

export default TicketService;
