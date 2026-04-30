import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingService from '../../services/BookingService';
import '../styles/CreateTicket.css';
import { ArrowLeft, AlertCircle, Calendar, Clock, Users } from 'lucide-react';
import { getResources } from '../../services/ResourceService';
import { getCurrentUser } from '../../utils/auth';

function CreateBooking() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resources, setResources] = useState([]);
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: '',
    resourceName: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    requestedBy: currentUser?.email || '',
    location: '',
    attendees: 1,
    notes: ''
  });

  useEffect(() => {
    getResources('', '', 'ACTIVE')
      .then((res) => setResources(res.data || []))
      .catch(() => setError('Failed to load active resources'));
  }, []);

  const resourceTypes = useMemo(
    () => ([
      { value: "CLASSROOM", label: "Classroom" },
      { value: "LAB", label: "Lab" },
      { value: "MEETING_ROOM", label: "Meeting Room" },
      { value: "AUDITORIUM", label: "Auditorium" },
      { value: "SPORTS_FACILITY", label: "Sports Facility" },
      { value: "LIBRARY_ROOM", label: "Library Room" },
      { value: "EVENT_SPACE", label: "Event Space" },
      { value: "OTHER", label: "Other" }
    ]),
    []
  );

  const availableResources = useMemo(
    () => resources.filter((resource) => String(resource.type || '') === String(formData.resourceType || '')),
    [resources, formData.resourceType]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'resourceType') {
      setFormData(prev => ({
        ...prev,
        resourceType: value,
        resourceName: '',
        location: ''
      }));
    }

    if (name === 'resourceName') {
      const selectedResource = resources.find((resource) => resource.name === value);
      setFormData(prev => ({
        ...prev,
        resourceName: value,
        location: selectedResource?.location || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.resourceType) {
      setError('Resource type is required');
      return;
    }
    if (!formData.resourceName) {
      setError('Resource name is required');
      return;
    }
    const selectedResource = resources.find((resource) => resource.name === formData.resourceName);
    if (!selectedResource) {
      setError('Selected resource is unavailable');
      return;
    }
    if (!formData.bookingDate) {
      setError('Booking date is required');
      return;
    }
    if (!formData.startTime) {
      setError('Start time is required');
      return;
    }
    if (!formData.endTime) {
      setError('End time is required');
      return;
    }
    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }
    if (!formData.requestedBy.trim()) {
      setError('Your email is required');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.bookingDate < today) {
      setError('Booking date cannot be in the past');
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        ...formData,
        location: selectedResource.location,
        attendees: parseInt(formData.attendees) || 1
      };

      const response = await BookingService.createBooking(bookingPayload);
      setSuccess(`Booking created successfully! Booking ID: ${response.data.bookingId}`);

      setTimeout(() => {
        navigate(`/bookingdetails/${response.data.id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking. Time slot may be unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ticket-container">
      <div className="create-ticket-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={20} /> Back
        </button>
        <h1>Create New Booking</h1>
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
            <h3>Booking Information</h3>

            <div className="form-group">
              <label htmlFor="title">Event Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter event or booking title"
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
                placeholder="Enter detailed description of the event or purpose"
                className="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="resourceType">Resource Type *</label>
                <select
                  id="resourceType"
                  name="resourceType"
                  value={formData.resourceType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">-- Select Type --</option>
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="resourceName">Resource Name *</label>
                <select
                  id="resourceName"
                  name="resourceName"
                  value={formData.resourceName}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={!formData.resourceType}
                >
                  <option value="">-- Select Resource --</option>
                  {availableResources.map((resource) => (
                    <option key={resource.id} value={resource.name}>{resource.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bookingDate">
                <Calendar size={16} style={{ marginRight: '6px' }} />
                Booking Date *
              </label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startTime">
                  <Clock size={16} style={{ marginRight: '6px' }} />
                  Start Time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">
                  <Clock size={16} style={{ marginRight: '6px' }} />
                  End Time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  readOnly
                  placeholder="Auto-filled from selected resource"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="attendees">
                  <Users size={16} style={{ marginRight: '6px' }} />
                  Number of Attendees
                </label>
                <input
                  type="number"
                  id="attendees"
                  name="attendees"
                  value={formData.attendees}
                  onChange={handleInputChange}
                  min="1"
                  max="500"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="requestedBy">Your Email *</label>
              <input
                type="email"
                id="requestedBy"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional requirements or notes"
                className="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBooking;
