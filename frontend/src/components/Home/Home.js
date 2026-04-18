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

const modules = [
  {
    id: 'facilities',
    title: 'Facilities & Assets Catalogue',
    owner: 'Member 1',
    description:
      'A central place to explore campus spaces, equipment, and asset details.',
    status: 'Planned module',
    accent: 'amber',
    icon: Building2,
    actions: []
  },
  {
    id: 'booking',
    title: 'Booking Management',
    owner: 'Member 2',
    description:
      'Handles reservations, availability checks, and scheduling for campus resources.',
    status: 'Planned module',
    accent: 'teal',
    icon: CalendarCheck,
    actions: []
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
      { label: 'Create Ticket', to: '/createticket', primary: true },
      { label: 'View Tickets', to: '/alltickets', primary: false }
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
    text: 'Book spaces and resources once the booking module is connected by the team.'
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

  const handleSignOut = () => {
    signOutUser();
    navigate('/', { replace: true });
  };

  return (
    <div className="campus-home">
      <header className="campus-hero">
        <nav className="campus-nav">
          <div className="campus-brand">
            <div className="brand-mark">
              <Ticket size={22} />
            </div>
            <div>
              <p className="brand-label">Smart Campus Platform</p>
              <h1>Campus Services Home</h1>
            </div>
          </div>

          <div className="campus-nav-links">
            <a href="#modules" className="nav-item">Modules</a>
            <a href="#flow" className="nav-item">Flow</a>
            {currentUser && <span className="nav-user">{currentUser.fullName}</span>}
            <Link to="/alltickets" className="nav-cta">Open Ticketing</Link>
            <button type="button" className="nav-signout" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </nav>

        <div className="hero-layout">
          <section className="hero-copy">
            <span className="hero-badge">Integrated student and staff service portal</span>
            <h2>One homepage for the full project, with your ticketing module ready to use.</h2>
            <p>
              This landing page introduces all four parts of the smart campus system while
              keeping implementation boundaries clear. The maintenance and incident ticketing
              area is connected now, and the other modules are presented as upcoming team
              integrations.
            </p>

            <div className="hero-actions">
              <Link to="/createticket" className="primary-action">
                <ClipboardPlus size={18} />
                Report an Issue
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
                <span>Live Module</span>
              </div>
              <h3>Maintenance & Incident Ticketing</h3>
              <p>Your implemented area is available from this homepage right now.</p>
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
                      module.actions.map((action) => (
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
