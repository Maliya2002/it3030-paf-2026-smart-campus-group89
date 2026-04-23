import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Ticket, AlertCircle } from 'lucide-react';
import '../styles/Home.css';


function Home() {
  return (
    <div className="home-container">
      <nav className="navbar-home">
        <div className="navbar-brand">
          <Ticket className="brand-icon" />
          <span className="brand-text">Ticket Management System</span>
        </div>
        <div className="navbar-links">
          <Link to="/alltickets" className="nav-link">All Tickets</Link>
          <Link to="/createticket" className="nav-link">Create Ticket</Link>
          
          
          <Link to="/resources" className="nav-link">Resources</Link>
          <Link to="/create-resource" className="nav-link">Add Resource</Link>
        </div>
      </nav>

      <div className="home-content">
        <div className="hero-section">
          <div className="hero-icon">
            <AlertCircle size={80} />
          </div>
          <h1>Maintenance & Incident Ticketing System</h1>
          <p>Efficiently manage and track maintenance requests and incidents</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Create Tickets</h3>
            <p>Report incidents and maintenance requests quickly</p>
            <Link to="/createticket" className="feature-btn">
              <Plus size={20} /> Create Now
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>View All Tickets</h3>
            <p>Track all tickets with advanced filtering options</p>
            <Link to="/alltickets" className="feature-btn">
              View Tickets
            </Link>
          </div>
        
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Manage Resources</h3>
            <p>View and search rooms, labs, and equipment</p>
            <Link to="/resources" className="feature-btn">
              View Resources
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">➕</div>
            <h3>Add Resource</h3>
            <p>Create new rooms, labs, or equipment entries</p>
            <Link to="/create-resource" className="feature-btn">
              Add Now
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Track Progress</h3>
            <p>Monitor ticket status and resolution in real-time</p>
            <Link to="/alltickets" className="feature-btn">
              Track Now
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Add Comments</h3>
            <p>Communicate with technicians via comments</p>
            <Link to="/alltickets" className="feature-btn">
              Browse
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Upload Images</h3>
            <p>Attach up to 3 images per ticket for reference</p>
            <Link to="/createticket" className="feature-btn">
              Start Reporting
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Assign Technicians</h3>
            <p>Assign tickets to team members for action</p>
            <Link to="/alltickets" className="feature-btn">
              Manage
            </Link>
          </div>
        </div>

        <div className="info-section">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Create</h4>
              <p>Create a new ticket with title, description, and priority</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Assign</h4>
              <p>Assign technician and set priority level</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Track</h4>
              <p>Monitor progress and add comments</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Resolve</h4>
              <p>Update status to resolved when complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;