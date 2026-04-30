import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketService from '../../services/TicketService';
import '../styles/CreateTicket.css';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

function CreateTicket() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: '',
    location: '',
    reportedBy: currentUser?.email || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.reportedBy.trim()) {
      setError('Reporter email is required');
      return;
    }
    if (!formData.category.trim()) {
      setError('Category is required');
      return;
    }

    setLoading(true);
    try {
      const response = await TicketService.createTicket(formData);
      setSuccess(`Ticket created successfully! Ticket ID: ${response.data.ticketId}`);
      
      setTimeout(() => {
        navigate('/alltickets');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.errorMessage || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-header">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Create New Ticket</h1>
      </div>

      <div className="create-ticket-form">
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Ticket Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter ticket title"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed description"
                className="form-textarea"
                rows="5"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">-- Select Category --</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Network">Network</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location (e.g., Building A, Office 102)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reportedBy">Your Email *</label>
              <input
                type="email"
                id="reportedBy"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/home')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTicket;
