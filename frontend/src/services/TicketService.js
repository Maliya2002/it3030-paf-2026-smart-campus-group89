import apiClient from './apiClient';

const API_BASE_URL = '/api/tickets';

const TicketService = {
  // Ticket CRUD Operations
  createTicket: (ticketData) => {
    return apiClient.post(API_BASE_URL, ticketData);
  },

  getAllTickets: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTechnician) params.append('assignedTechnician', filters.assignedTechnician);
    if (filters.category) params.append('category', filters.category);
    if (filters.reportedBy) params.append('reportedBy', filters.reportedBy);
    
    const query = params.toString() ? `?${params.toString()}` : '';
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
  },

  // Comment Operations
  addComment: (ticketId, commentData) => {
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
  },

  // Attachment Operations
  uploadAttachments: (ticketId, files, uploadedBy) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('uploadedBy', uploadedBy);
    
    return apiClient.post(`${API_BASE_URL}/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getAttachments: (ticketId) => {
    return apiClient.get(`${API_BASE_URL}/${ticketId}/attachments`);
  },

  deleteAttachment: (ticketId, attachmentId) => {
    return apiClient.delete(`${API_BASE_URL}/${ticketId}/attachments/${attachmentId}`);
  },

  downloadAttachment: (filename) => {
    return apiClient.get(`${API_BASE_URL}/uploads/${filename}`, {
      responseType: 'blob'
    });
  }
};

export default TicketService;
