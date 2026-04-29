import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  ClipboardPlus,
  ShieldCheck,
  Ticket,
  Wrench,
  Building2
} from 'lucide-react';
import '../styles/Home.css';
import { getCurrentUser, signOutUser } from '../../utils/auth';
import NotificationPanel from '../Notifications/NotificationPanel';

const modules = [
  {
    id: 'facilities',
    title: 'Facilities & Assets Catalogue',
    owner: 'Member 1',
    description:
      'A central place to explore campus spaces, equipment, and asset details.',
    status: 'Available now',
    accent: 'amber',
    icon: Building2,
    actions: [
      { label: 'View Resources', to: '/resources', primary: true, roles: ['USER', 'ADMIN'] },
      { label: 'Add Resource', to: '/create-resource', primary: false, roles: ['ADMIN'] }
    ]
  },
  {
    id: 'booking',
    title: 'Booking Management',
    owner: 'Member 2',
    description:
      'Handles reservations, availability checks, and scheduling for campus resources.',
    status: 'Available now',
    accent: 'teal',
    icon: CalendarCheck,
    actions: [
<<<<<<< HEAD
      { label: 'Create Booking', to: '/createbooking', primary: true, roles: ['USER', 'ADMIN'] },
      { label: 'View Bookings', to: '/allbookings', primary: false, roles: ['USER', 'ADMIN'] }
=======
      { label: 'Create Booking', to: '/createbooking', primary: true },
      { label: 'View Bookings', to: '/allbookings', primary: false }
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
    ]
  },
  {
    id: 'ticketing',
    title: 'Maintenance & Incident Ticketing',
    owner: 'Member 3',
    description:
      'Report problems, track requests, and manage maintenance work from one place.',
    status: 'Available now',
    accent: 'rose',
    icon: Wrench,
    actions: [
      { label: 'Create Ticket', to: '/createticket', primary: true, roles: ['USER', 'ADMIN'] },
      { label: 'View Tickets', to: '/alltickets', primary: false, roles: ['USER', 'ADMIN'] }
    ]
  },
  {
    id: 'access',
    title: 'Notifications + Auth + Roles',
    owner: 'Member 4',
    description:
      'Supports secure access, role-based permissions, and important system alerts.',
    status: 'Planned module',
    accent: 'slate',
    icon: ShieldCheck,
    actions: []
  }
];

const journeySteps = [
  {
    title: 'Discover',
    text: 'Browse facilities, campus assets, and the services available across the system.'
  },
  {
    title: 'Reserve',
    text: 'Book spaces and resources by selecting date, time, and expected attendees.'
  },
  {
    title: 'Report',
    text: 'Create maintenance or incident tickets whenever something needs attention.'
  },
  {
    title: 'Respond',
    text: 'Use notifications, authentication, and roles to keep actions secure and coordinated.'
  }
];


function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const handleSignOut = () => {
    signOutUser();
    navigate('/', { replace: true });
  };

  return (
<<<<<<< HEAD
    <div className="campus-home">
      <header className="campus-hero">
        <nav className="campus-nav">
          <div className="campus-brand">
            <div className="brand-mark">
              <Ticket size={22} />
=======
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
          <Link to="/create-resource" className="nav-link">Create Resource</Link>
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
>>>>>>> origin/Facilities-SASMITHA-P-M-V
            </div>
            <div>
              <p className="brand-label">Smart Campus Platform</p>
              <h1>Campus Services Home</h1>
            </div>
          </div>

          <div className="campus-nav-links">
            <a href="#modules" className="nav-item">Modules</a>
            <a href="#flow" className="nav-item">Flow</a>
            <Link to="/resources" className="nav-item">Facilities</Link>
<<<<<<< HEAD
            <NotificationPanel />
=======
            <Link to="/allbookings" className="nav-item">Bookings</Link>
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
            {currentUser && <span className="nav-user">{currentUser.fullName}</span>}
            {currentUser && <span className="nav-user role-pill">{currentUser.role}</span>}
            <Link to="/alltickets" className="nav-cta">Open Ticketing</Link>
            <button type="button" className="nav-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </nav>

        <div className="hero-layout">
          <section className="hero-copy">
            <span className="hero-badge">Integrated student and staff service portal</span>
<<<<<<< HEAD
            <h2>One homepage for the full project, with booking, facilities, and ticketing ready.</h2>
            <p>
              This landing page introduces all four parts of the smart campus system while
              keeping implementation boundaries clear. The maintenance and incident ticketing
              and booking areas are connected now, and the remaining modules are presented
              as upcoming team integrations.
=======
            <h2>One homepage for the full project, with booking, facilities, and ticketing ready to use.</h2>
            <p>
              This landing page introduces all four parts of the smart campus system while
              keeping implementation boundaries clear. Facilities, booking management, and
              maintenance ticketing are connected now, while remaining modules are upcoming
              team integrations.
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
            </p>

            <div className="hero-actions">
              <Link to="/createticket" className="primary-action">
                <ClipboardPlus size={18} />
                Report an Issue
              </Link>
              <Link to="/resources" className="secondary-action">
                <Building2 size={18} />
                Explore Facilities
              </Link>
<<<<<<< HEAD
              {isAdmin && (
                <Link to="/create-resource" className="secondary-action">
                  <Building2 size={18} />
                  Add Resource
                </Link>
              )}
=======
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
              <Link to="/allbookings" className="secondary-action">
                <CalendarCheck size={18} />
                View Bookings
              </Link>
              <Link to="/alltickets" className="secondary-action">
                <Ticket size={18} />
                View Ticket Dashboard
              </Link>
            </div>
          </section>

          <aside className="hero-panel">
            <div className="panel-card live-card">
              <div className="panel-header">
                <Wrench size={18} />
                <span>Live Modules</span>
              </div>
              <h3>Ticketing + Facilities + Booking</h3>
<<<<<<< HEAD
              <p>Resource catalogue and booking workflow are connected through the homepage.</p>
=======
              <p>Booking is now connected with two quick actions in the module tile.</p>
>>>>>>> f23bae5a5ecc0b9d3f431dbbf88d30e011ac1b5b
            </div>

            <div className="panel-grid">
              <div className="panel-card mini-card">
                <Building2 size={18} />
                <span>Facilities</span>
              </div>
              <div className="panel-card mini-card">
                <CalendarCheck size={18} />
                <span>Bookings</span>
              </div>
              <div className="panel-card mini-card">
                <BellRing size={18} />
                <span>Alerts & Access</span>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main className="campus-main">
        <section className="module-section" id="modules">
          <div className="section-heading">
            <p className="section-kicker">Project modules</p>
            <h3>How the four parts connect in one system</h3>
            <p>
              Each team member owns a separate area. This homepage brings them together without
              overlapping implementation responsibility.
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <article key={module.id} className={`module-card accent-${module.accent}`}>
                  <div className="module-top">
                    <div className="module-icon">
                      <Icon size={24} />
                    </div>
                    <span className="module-status">{module.status}</span>
                  </div>

                  <p className="module-owner">{module.owner}</p>
                  <h4>{module.title}</h4>
                  <p className="module-description">{module.description}</p>

                  <div className="module-actions">
                    {module.actions.length > 0 ? (
                      module.actions
                        .filter((action) => !action.roles || action.roles.includes(currentUser?.role))
                        .map((action) => (
                        <Link
                          key={action.to}
                          to={action.to}
                          className={action.primary ? 'module-link primary' : 'module-link'}
                        >
                          {action.label}
                          <ArrowRight size={16} />
                        </Link>
                        ))
                    ) : (
                      <span className="module-placeholder">UI entry reserved for team integration</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="flow-section" id="flow">
          <div className="section-heading">
            <p className="section-kicker">System flow</p>
            <h3>A simple journey across the smart campus experience</h3>
          </div>

          <div className="journey-grid">
            {journeySteps.map((step, index) => (
              <div key={step.title} className="journey-card">
                <span className="journey-number">0{index + 1}</span>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
