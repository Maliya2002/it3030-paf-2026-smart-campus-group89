import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingService from '../../services/BookingService';
import '../styles/TicketDetails.css';
import { ArrowLeft, AlertCircle, Loader, Trash2, Calendar, Clock, Users, MapPin, CheckCircle, XCircle } from 'lucide-react';

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const response = await BookingService.getBookingById(id);
      setBooking(response.data);
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await BookingService.updateBookingStatus(id, newStatus);
      setSuccessMessage(`Status updated to ${newStatus} successfully!`);
      fetchBookingDetails();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDeleteBooking = async () => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await BookingService.deleteBooking(id);
      navigate('/allbookings');
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  const handleEditBooking = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const updatedData = {
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        attendees: parseInt(formData.get('attendees')),
        notes: formData.get('notes')
      };

      await BookingService.updateBooking(id, updatedData);
      setSuccessMessage('Booking updated successfully!');
      setIsEditing(false);
      fetchBookingDetails();
    } catch (err) {
      setError('Failed to update booking');
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
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="ticket-details-container">
        <div className="content-section">
          <div className="alert alert-error">
            <AlertCircle size={20} /> Booking not found
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      case 'REJECTED': return 'status-rejected';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  const canModify = booking.status !== 'CANCELLED' && booking.status !== 'REJECTED' && booking.status !== 'COMPLETED';

  return (
    <div className="ticket-details-container">
      <div className="ticket-details-header">
        <button className="back-btn" onClick={() => navigate('/allbookings')}>
          <ArrowLeft size={20} /> Back to Bookings
        </button>
        <h1>{booking.bookingId}</h1>
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
              <h2>{booking.title}</h2>
              <span className={`status-badge ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
          </div>

          <div className="tab-content">
            {isEditing ? (
              <form onSubmit={handleEditBooking} className="edit-form">
                <div className="details-section">
                  <h3>Edit Booking</h3>

                  <div className="form-group">
                    <label htmlFor="title">Event Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      defaultValue={booking.title}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      defaultValue={booking.description}
                      className="form-textarea"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      defaultValue={booking.location}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="attendees">Number of Attendees</label>
                      <input
                        type="number"
                        id="attendees"
                        name="attendees"
                        defaultValue={booking.attendees}
                        min="1"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      defaultValue={booking.notes || ''}
                      className="form-textarea"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div className="details-section">
                  <h3>Description</h3>
                  <p className="description-text">{booking.description}</p>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <label>Resource Type</label>
                    <div>{booking.resourceType}</div>
                  </div>
                  <div className="detail-item">
                    <label>Resource Name</label>
                    <div>{booking.resourceName}</div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <Calendar size={14} style={{ marginRight: '4px' }} />
                      Booking Date
                    </label>
                    <div>{formatDate(booking.bookingDate)}</div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <Clock size={14} style={{ marginRight: '4px' }} />
                      Time
                    </label>
                    <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <MapPin size={14} style={{ marginRight: '4px' }} />
                      Location
                    </label>
                    <div>{booking.location || 'N/A'}</div>
                  </div>
                  <div className="detail-item">
                    <label>
                      <Users size={14} style={{ marginRight: '4px' }} />
                      Attendees
                    </label>
                    <div>{booking.attendees || 'N/A'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Requested By</label>
                    <div>{booking.requestedBy}</div>
                  </div>
                  <div className="detail-item">
                    <label>Created</label>
                    <div>{formatDateTime(booking.createdAt)}</div>
                  </div>
                  {booking.approvedBy && (
                    <>
                      <div className="detail-item">
                        <label>Approved By</label>
                        <div>{booking.approvedBy}</div>
                      </div>
                      <div className="detail-item">
                        <label>Approved At</label>
                        <div>{formatDateTime(booking.approvedAt)}</div>
                      </div>
                    </>
                  )}
                </div>

                {booking.notes && (
                  <div className="details-section">
                    <h3>Additional Notes</h3>
                    <p className="description-text">{booking.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ticket-sidebar">
          <div className="sidebar-section">
            <h3>Actions</h3>

            <div className="status-selector">
              <label>Change Status</label>
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="selector"
                disabled={!canModify}
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {canModify && (
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
                style={{ marginTop: '10px', width: '100%' }}
              >
                Edit Booking
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={handleDeleteBooking}
              style={{ marginTop: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Trash2 size={16} /> Delete Booking
            </button>
          </div>

          <div className="sidebar-section">
            <h3>Booking Info</h3>
            <div className="info-item">
              <span className="label">Booking ID:</span>
              <span className="value">{booking.bookingId}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`value status-${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Resource:</span>
              <span className="value">{booking.resourceName}</span>
            </div>
            <div className="info-item">
              <span className="label">Type:</span>
              <span className="value">{booking.resourceType}</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Actions</h3>
            {booking.status === 'PENDING' && (
              <button
                className="btn btn-success"
                onClick={() => handleStatusChange('CONFIRMED')}
                style={{ width: '100%', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <CheckCircle size={16} /> Confirm Booking
              </button>
            )}
            {booking.status === 'PENDING' && (
              <button
                className="btn btn-danger"
                onClick={() => handleStatusChange('REJECTED')}
                style={{ width: '100%', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <XCircle size={16} /> Reject Booking
              </button>
            )}
            {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
              <button
                className="btn btn-warning"
                onClick={() => handleStatusChange('CANCELLED')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <XCircle size={16} /> Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetails;
