import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TicketService from '../../services/TicketService';
import '../styles/TicketList.css';
import { Plus, Search, Filter, AlertCircle, Loader } from 'lucide-react';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedTechnician: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  const fetchTickets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await TicketService.getAllTickets(filters);
      let filteredTickets = response.data;

      // Client-side search
      if (searchQuery) {
        filteredTickets = filteredTickets.filter(ticket =>
          ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setTickets(filteredTickets);
    } catch (err) {
      setError('Failed to load tickets');
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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'priority-critical';
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <div className="header-top">
          <h1>All Tickets</h1>
          <Link to="/createticket" className="btn btn-primary btn-sm">
            <Plus size={18} /> Create Ticket
          </Link>
        </div>

        <div className="search-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by Ticket ID or Title..."
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
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Equipment">Equipment</option>
            <option value="Security">Security</option>
          </select>
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
          <p>Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <Link
              to={`/ticketdetails/${ticket.id}`}
              key={ticket.id}
              className="ticket-card"
            >
              <div className="ticket-card-header">
                <div className="ticket-id-section">
                  <span className="ticket-id">{ticket.ticketId}</span>
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>

              <div className="ticket-card-body">
                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description">{ticket.description.substring(0, 80)}...</p>
                
                <div className="ticket-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{ticket.category}</span>
                  </div>
                  {ticket.assignedTechnician && (
                    <div className="meta-item">
                      <span className="meta-label">Assigned:</span>
                      <span className="meta-value">{ticket.assignedTechnician.split('@')[0]}</span>
                    </div>
                  )}
                </div>

                <div className="ticket-footer">
                  <span className="created-date">{formatDate(ticket.createdAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
