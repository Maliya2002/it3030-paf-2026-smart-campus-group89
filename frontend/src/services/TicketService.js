import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tickets';

const TicketService = {
  // Ticket CRUD Operations
  createTicket: (ticketData) => {
    return axios.post(API_BASE_URL, ticketData);
  },

  getAllTickets: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assignedTechnician) params.append('assignedTechnician', filters.assignedTechnician);
    if (filters.category) params.append('category', filters.category);
    if (filters.reportedBy) params.append('reportedBy', filters.reportedBy);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return axios.get(`${API_BASE_URL}${query}`);
  },

  getTicketById: (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
  },

  updateTicket: (id, ticketData, files = null) => {
    const formData = new FormData();
    formData.append('ticketData', JSON.stringify(ticketData));
    
    if (files) {
      files.forEach(file => formData.append('file', file));
    }
    
    return axios.put(`${API_BASE_URL}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteTicket: (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
  },

  // Comment Operations
  addComment: (ticketId, commentData) => {
    return axios.post(`${API_BASE_URL}/${ticketId}/comments`, commentData);
  },

  getComments: (ticketId) => {
    return axios.get(`${API_BASE_URL}/${ticketId}/comments`);
  },

  editComment: (ticketId, commentId, commentData) => {
    return axios.put(`${API_BASE_URL}/${ticketId}/comments/${commentId}`, commentData);
  },

  deleteComment: (ticketId, commentId, commentedBy) => {
    return axios.delete(`${API_BASE_URL}/${ticketId}/comments/${commentId}?commentedBy=${commentedBy}`);
  },

  // Attachment Operations
  uploadAttachments: (ticketId, files, uploadedBy) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('uploadedBy', uploadedBy);
    
    return axios.post(`${API_BASE_URL}/${ticketId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getAttachments: (ticketId) => {
    return axios.get(`${API_BASE_URL}/${ticketId}/attachments`);
  },

  deleteAttachment: (ticketId, attachmentId) => {
    return axios.delete(`${API_BASE_URL}/${ticketId}/attachments/${attachmentId}`);
  },

  downloadAttachment: (filename) => {
    return axios.get(`${API_BASE_URL}/uploads/${filename}`, {
      responseType: 'blob'
    });
  }
};

export default TicketService;
