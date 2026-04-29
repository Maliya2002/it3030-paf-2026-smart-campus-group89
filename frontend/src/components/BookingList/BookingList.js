import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookingService from '../../services/BookingService';
import '../styles/TicketList.css';
import { Plus, Search, Filter, AlertCircle, Loader, Calendar, Clock } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

function BookingList() {
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    requestedBy: isAdmin ? '' : currentUser?.email || '',
    resourceType: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await BookingService.getAllBookings(filters);
      let filteredBookings = response.data;

      if (searchQuery) {
        filteredBookings = filteredBookings.filter(booking =>
          booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.resourceName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setBookings(filteredBookings);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-confirmed';
      case 'CANCELLED': return 'status-cancelled';
      case 'REJECTED': return 'status-rejected';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <div className="header-top">
          <h1>{isAdmin ? 'All Bookings' : 'My Bookings'}</h1>
          <Link to="/createbooking" className="btn btn-primary btn-sm">
            <Plus size={18} /> Create Booking
          </Link>
        </div>

        <div className="search-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by Booking ID, Title, or Resource..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-icon">
            <Filter size={18} /> Filters:
          </div>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            name="resourceType"
            value={filters.resourceType}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Resource Types</option>
            <option value="CLASSROOM">Classroom</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="AUDITORIUM">Auditorium</option>
            <option value="SPORTS_FACILITY">Sports Facility</option>
            <option value="LIBRARY_ROOM">Library Room</option>
            <option value="EVENT_SPACE">Event Space</option>
            <option value="OTHER">Other</option>
          </select>

          {isAdmin && (
            <input
              type="text"
              name="requestedBy"
              value={filters.requestedBy}
              onChange={handleFilterChange}
              className="search-input"
              placeholder="Filter by requester email"
            />
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <Loader className="loading-spinner" size={40} />
          <p>Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found</p>
          <Link to="/createbooking" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Your First Booking
          </Link>
        </div>
      ) : (
        <div className="tickets-grid">
          {bookings.map(booking => (
            <Link
              to={`/bookingdetails/${booking.id}`}
              key={booking.id}
              className="ticket-card"
            >
              <div className="ticket-card-header">
                <div className="ticket-id-section">
                  <span className="ticket-id">{booking.bookingId}</span>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="ticket-card-body">
                <h3 className="ticket-title">{booking.title}</h3>
                <p className="ticket-description">{booking.description.substring(0, 80)}...</p>

                <div className="booking-resource-info">
                  <div className="meta-item">
                    <span className="meta-label">Resource:</span>
                    <span className="meta-value">{booking.resourceName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Type:</span>
                    <span className="meta-value">{booking.resourceType}</span>
                  </div>
                </div>

                <div className="booking-datetime">
                  <div className="datetime-item">
                    <Calendar size={14} />
                    <span>{formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="datetime-item">
                    <Clock size={14} />
                    <span>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                  </div>
                </div>

                <div className="ticket-footer">
                  <span className="created-date">
                    Requested by: {booking.requestedBy.split('@')[0]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingList;
