import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketService from '../../services/TicketService';
import '../styles/TicketDetails.css';
import { ArrowLeft, AlertCircle, Loader, Trash2 } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [deletingTicket, setDeletingTicket] = useState(false);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await TicketService.getComments(id);
<<<<<<< HEAD
      setComments(Array.isArray(response?.data) ? response.data : []);
=======
      setComments(Array.isArray(response.data) ? response.data : []);
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
    } catch (err) {
      setComments([]);
    }
  };

  const fetchAttachments = async () => {
    try {
      const response = await TicketService.getAttachments(id);
<<<<<<< HEAD
      setAttachments(Array.isArray(response?.data) ? response.data : []);
=======
      setAttachments(Array.isArray(response.data) ? response.data : []);
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
    } catch (err) {
      setAttachments([]);
    }
  };

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const [ticketResponse, commentsResponse, attachmentsResponse] = await Promise.all([
        TicketService.getTicketById(id),
        TicketService.getComments(id),
        TicketService.getAttachments(id)
      ]);
<<<<<<< HEAD

      setTicket(ticketResponse.data);
      setAssignedTechnician(ticketResponse.data?.assignedTechnician || '');
      setComments(Array.isArray(commentsResponse?.data) ? commentsResponse.data : []);
      setAttachments(Array.isArray(attachmentsResponse?.data) ? attachmentsResponse.data : []);
=======
      setTicket(ticketResponse.data);
      setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);
      setAttachments(Array.isArray(attachmentsResponse.data) ? attachmentsResponse.data : []);
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
    } catch (err) {
      setError('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setError('');
      const updatedData = { status: newStatus };
      await TicketService.updateTicket(id, updatedData);
      setSuccessMessage('Status updated successfully!');
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleAssignmentSave = async () => {
    try {
      setSavingAssignment(true);
      setError('');
      const cleanedTechnician = assignedTechnician.trim();
      await TicketService.updateTicket(id, {
        assignedTechnician: cleanedTechnician || null
      });
      setSuccessMessage(cleanedTechnician ? 'Technician assigned successfully!' : 'Technician assignment cleared.');
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to update assigned technician');
    } finally {
      setSavingAssignment(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm('Delete this ticket permanently?')) return;
    try {
      setDeletingTicket(true);
      setError('');
      await TicketService.deleteTicket(id);
      navigate('/alltickets');
    } catch (err) {
      setError('Failed to delete ticket');
    } finally {
      setDeletingTicket(false);
    }
  };

  const setSuccessMessage = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="loading-spinner" size={40} />
        <p>Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-details-container">
        <div className="content-section">
          <div className="alert alert-error">
            <AlertCircle size={20} /> Ticket not found
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'RESOLVED': return 'status-resolved';
      case 'CLOSED': return 'status-closed';
      case 'ON_HOLD': return 'status-on-hold';
      default: return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'priority-critical';
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (minutes === null || minutes === undefined) return 'Pending';
    const safe = Number(minutes);
    if (Number.isNaN(safe) || safe < 0) return 'N/A';
    if (safe < 60) return `${safe} minutes`;
    const hours = Math.floor(safe / 60);
    const remainingMinutes = safe % 60;
    if (hours < 24) return `${hours} hours ${remainingMinutes} minutes`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} days ${remainingHours} hours ${remainingMinutes} minutes`;
  };

  return (
    <div className="ticket-details-container">
      <div className="ticket-details-header">
        <button className="back-btn" onClick={() => navigate('/alltickets')}>
          <ArrowLeft size={20} /> Back to Tickets
        </button>
        <h1>{ticket.ticketId}</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} /> {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="ticket-details-layout">
        <div className="ticket-main">
          <div className="ticket-header-section">
            <div className="ticket-title-section">
              <h2>{ticket.title}</h2>
              <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace(/_/g, ' ')}
              </span>
            </div>
            <span className={`priority-badge-large ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority} Priority
            </span>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments ({comments.length})
            </button>
            <button 
              className={`tab ${activeTab === 'attachments' ? 'active' : ''}`}
              onClick={() => setActiveTab('attachments')}
            >
              Attachments ({attachments.length})
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="tab-content">
              <div className="details-section">
                <h3>Description</h3>
                <p className="description-text">{ticket.description}</p>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <label>Category</label>
                  <div>{ticket.category}</div>
                </div>
                <div className="detail-item">
                  <label>Location</label>
                  <div>{ticket.location || 'N/A'}</div>
                </div>
                <div className="detail-item">
                  <label>Reported By</label>
                  <div>{ticket.reportedBy}</div>
                </div>
                <div className="detail-item">
                  <label>Created</label>
                  <div>{formatDate(ticket.createdAt)}</div>
                </div>
                <div className="detail-item">
                  <label>Last Updated</label>
                  <div>{formatDate(ticket.updatedAt)}</div>
                </div>
                <div className="detail-item">
                  <label>Time to First Response</label>
                  <div>{formatDuration(ticket.timeToFirstResponseMinutes)}</div>
                </div>
                <div className="detail-item">
                  <label>Time to Resolution</label>
                  <div>{formatDuration(ticket.timeToResolutionMinutes)}</div>
                </div>
                {ticket.firstRespondedAt && (
                  <div className="detail-item">
                    <label>First Responded</label>
                    <div>{formatDate(ticket.firstRespondedAt)}</div>
                  </div>
                )}
                {ticket.resolvedAt && (
                  <div className="detail-item">
                    <label>Resolved</label>
                    <div>{formatDate(ticket.resolvedAt)}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <CommentsSection ticketId={id} comments={comments} onUpdate={fetchComments} />
          )}

          {activeTab === 'attachments' && (
            <AttachmentsSection ticketId={id} attachments={attachments} onUpdate={fetchAttachments} />
          )}
        </div>

        <div className="ticket-sidebar">
          <div className="sidebar-section">
            <h3>Actions</h3>
            <div className="status-selector">
              <label>Change Status</label>
              <select 
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="selector"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            <div className="assignment-section">
              <label>Assigned Technician</label>
              <input
                type="email"
                placeholder="technician@campus.com"
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                className="selector"
              />
              <button
                type="button"
                className="btn btn-primary action-btn"
                onClick={handleAssignmentSave}
                disabled={savingAssignment}
              >
                {savingAssignment ? 'Saving...' : 'Save Assignment'}
              </button>
            </div>

            <div className="assignment-section">
              <label>Delete Ticket</label>
              <button
                type="button"
                className="btn btn-danger action-btn"
                onClick={handleDeleteTicket}
                disabled={deletingTicket}
              >
                {deletingTicket ? 'Deleting...' : 'Delete Ticket'}
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Ticket Info</h3>
            <div className="info-item">
              <span className="label">Ticket ID:</span>
              <span className="value">{ticket.ticketId}</span>
            </div>
            <div className="info-item">
              <span className="label">Priority:</span>
              <span className={`value priority-${ticket.priority.toLowerCase()}`}>
                {ticket.priority}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Category:</span>
              <span className="value">{ticket.category}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`value status-${ticket.status.toLowerCase().replace(/_/g, '-')}`}>
                {ticket.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentsSection({ ticketId, comments, onUpdate }) {
  const currentUser = getCurrentUser();
  const [commentText, setCommentText] = useState('');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !userEmail.trim()) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      await TicketService.addComment(ticketId, {
        commentedBy: userEmail,
        commentText: commentText
      });
      setCommentText('');
      onUpdate();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId, commentEmail) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await TicketService.deleteComment(ticketId, commentId, commentEmail);
      onUpdate();
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.commentedBy}</span>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                <button 
                  className="comment-delete-btn"
                  onClick={() => handleDeleteComment(comment.id, comment.commentedBy)}
                  title="Delete comment"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="comment-text">{comment.commentText}</p>
            </div>
          ))
        ) : (
          <p className="empty-message">No comments yet</p>
        )}
      </div>

      <form onSubmit={handleAddComment} className="comment-form">
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          placeholder="Your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="form-input"
        />
        <textarea
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="form-textarea"
          rows="3"
        ></textarea>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
}

function AttachmentsSection({ ticketId, attachments, onUpdate }) {
  const currentUser = getCurrentUser();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(null);
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const invalidType = selectedFiles.find((file) => !file.type.startsWith('image/'));
    if (invalidType) {
      setError('Only image files are allowed');
      setFiles(null);
      return;
    }
    if (selectedFiles.length + (attachments?.length || 0) > 3) {
      setError('Maximum 3 attachments allowed per ticket');
      setFiles(null);
      return;
    }
    setFiles(selectedFiles);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0 || !userEmail.trim()) {
      setError('Please select files and enter your email');
      return;
    }

    setLoading(true);
    try {
      await TicketService.uploadAttachments(ticketId, files, userEmail);
      setFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload attachments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (attachmentId) => {
    if (!window.confirm('Delete this attachment?')) return;
    try {
      await TicketService.deleteAttachment(ticketId, attachmentId);
      onUpdate();
    } catch (err) {
      setError('Failed to delete attachment');
    }
  };

  return (
    <div className="attachments-section">
      <div className="attachments-list">
        {attachments && attachments.length > 0 ? (
          <div className="attachments-grid">
            {attachments.map(attachment => (
              <div key={attachment.id} className="attachment-card">
                {attachment.filePath ? (
                  <img
                    src={`http://localhost:8080/api/tickets/uploads/${attachment.filePath}`}
                    alt={attachment.fileName}
                    className="attachment-preview"
                  />
                ) : (
                  <div className="attachment-icon">📎</div>
                )}
                <div className="attachment-info">
                  <h4>{attachment.fileName}</h4>
                  <p className="file-type">{attachment.fileType}</p>
                  <p className="file-size">{(attachment.fileSize / 1024).toFixed(2)} KB</p>
                  <p className="uploaded-by">By: {attachment.uploadedBy}</p>
                </div>
                <button
                  className="attachment-delete-btn"
                  onClick={() => handleDelete(attachment.id)}
                  title="Delete attachment"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No attachments yet</p>
        )}
      </div>

      <form onSubmit={handleUpload} className="upload-form">
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          placeholder="Your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="form-input"
        />
        <div className="file-input-wrapper">
          <input
            id={`attachment-input-${ticketId}`}
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="file-input"
            accept="image/*"
          />
          <label htmlFor={`attachment-input-${ticketId}`} className="file-input-label">
            {files ? `${files.length} file(s) selected` : 'Choose images (max 3)'}
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Attachments'}
        </button>
      </form>
    </div>
  );
}

export default TicketDetails;
