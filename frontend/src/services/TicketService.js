import api from './api';

const TicketService = {
  // Ticket CRUD Operations
  createTicket: (ticketData) => {
    return api.post('/tickets', ticketData);
  },

  getAllTickets: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTechnician) params.append('assignedTechnician', filters.assignedTechnician);
    if (filters.category) params.append('category', filters.category);
    if (filters.reportedBy) params.append('reportedBy', filters.reportedBy);

    const query = params.toString() ? `?${params.toString()}` : '';
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
  },

  // Comment Operations
  addComment: (ticketId, commentData) => {
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
  },

  // Attachment Operations
  uploadAttachments: (ticketId, files, uploadedBy) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('uploadedBy', uploadedBy);

    return api.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getAttachments: (ticketId) => {
    return api.get(`/tickets/${ticketId}/attachments`);
  },

  deleteAttachment: (ticketId, attachmentId) => {
    return api.delete(`/tickets/${ticketId}/attachments/${attachmentId}`);
  },

  downloadAttachment: (filename) => {
    return api.get(`/tickets/uploads/${filename}`, {
      responseType: 'blob'
    });
  }
};

export default TicketService;
