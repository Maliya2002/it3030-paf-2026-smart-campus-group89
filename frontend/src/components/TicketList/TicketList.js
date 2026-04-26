import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Filter, Loader, Plus, Search } from 'lucide-react';
import TicketService from '../../services/TicketService';
import '../styles/TicketList.css';

const EMPTY_FILTERS = {
  status: '',
  priority: '',
  category: '',
  assignedTechnician: ''
};

const extractTicketsArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.tickets)) return payload.tickets;
  return [];
};

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await TicketService.getAllTickets(filters);
        const parsedTickets = extractTicketsArray(response?.data).filter((ticket) => ticket && typeof ticket === 'object');
        setTickets(parsedTickets);
      } catch (fetchError) {
        setTickets([]);
        setError('Failed to load tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [filters]);

  const visibleTickets = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;
    return list.filter((ticket) => {
      const ticketId = String(ticket.ticketId || '').toLowerCase();
      const title = String(ticket.title || '').toLowerCase();
      return ticketId.includes(query) || title.includes(query);
    });
  }, [tickets, searchQuery]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'priority-critical';
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'status-open';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'RESOLVED': return 'status-resolved';
      case 'CLOSED': return 'status-closed';
      case 'ON_HOLD': return 'status-on-hold';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString('en-US', {
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
              onChange={(event) => setSearchQuery(event.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-icon">
            <Filter size={18} /> Filters:
          </div>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="ON_HOLD">On Hold</option>
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilterChange} className="filter-select">
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
            <option value="">All Categories</option>
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
      ) : visibleTickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {visibleTickets.map((ticket, index) => (
            <Link
              to={ticket?.id ? `/ticketdetails/${ticket.id}` : '/alltickets'}
              key={ticket?.id || ticket?.ticketId || `ticket-${index}`}
              className="ticket-card"
            >
              <div className="ticket-card-header">
                <div className="ticket-id-section">
                  <span className="ticket-id">{ticket.ticketId || 'TKT-UNKNOWN'}</span>
                  <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                    {String(ticket.status || 'OPEN').replace(/_/g, ' ')}
                  </span>
                </div>
                <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority || 'MEDIUM'}
                </span>
              </div>
              <div className="ticket-card-body">
                <h3 className="ticket-title">{ticket.title || 'Untitled ticket'}</h3>
                <p className="ticket-description">{String(ticket.description || '').slice(0, 80)}...</p>
                <div className="ticket-meta">
                  <div className="meta-item">
                    <span className="meta-label">Category:</span>
                    <span className="meta-value">{ticket.category || 'Not set'}</span>
                  </div>
                  {ticket.assignedTechnician && (
                    <div className="meta-item">
                      <span className="meta-label">Assigned:</span>
                      <span className="meta-value">{String(ticket.assignedTechnician).split('@')[0]}</span>
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
