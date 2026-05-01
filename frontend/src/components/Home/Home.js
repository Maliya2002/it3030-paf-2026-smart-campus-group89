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
  Building2,
  LayoutDashboard,
  LogOut,
  User
} from 'lucide-react';
import '../styles/Home.css';
import { getCurrentUser, signOutUser } from '../../utils/auth';
import NotificationPanel from '../Notifications/NotificationPanel';

const modules = [
  {
    id: 'facilities',
    title: 'Facilities & Assets Catalogue',
    owner: 'Member 1',
    description: 'A central place to explore campus spaces, equipment, and asset details.',
    status: 'Live',
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
    description: 'Handles reservations, availability checks, and scheduling for campus resources.',
    status: 'Live',
    accent: 'teal',
    icon: CalendarCheck,
    actions: [
      { label: 'Create Booking', to: '/createbooking', primary: true, roles: ['USER', 'ADMIN'] },
      { label: 'View Bookings', to: '/allbookings', primary: false, roles: ['USER', 'ADMIN'] }
    ]
  },
  {
    id: 'ticketing',
    title: 'Maintenance & Incident Ticketing',
    owner: 'Member 3',
    description: 'Report problems, track requests, and manage maintenance work from one place.',
    status: 'Live',
    accent: 'rose',
    icon: Wrench,
    actions: [
      { label: 'Create Ticket', to: '/createticket', primary: true, roles: ['USER', 'ADMIN'] },
      { label: 'View Tickets', to: '/alltickets', primary: false, roles: ['USER', 'ADMIN'] }
    ]
  }
];

const journeySteps = [
  {
    title: 'Discover',
    icon: Building2,
    text: 'Browse facilities, campus assets, and the services available across the system.'
  },
  {
    title: 'Reserve',
    icon: CalendarCheck,
    text: 'Book spaces and resources by selecting date, time, and expected attendees.'
  },
  {
    title: 'Report',
    icon: Wrench,
    text: 'Create maintenance or incident tickets whenever something needs attention.'
  },
  {
    title: 'Respond',
    icon: BellRing,
    text: 'Use notifications, authentication, and roles to keep actions secure and coordinated.'
  }
];

const stats = [
  { label: 'Active Modules', value: '3', color: 'teal' },
  { label: 'Campus Resources', value: '∞', color: 'amber' },
  { label: 'System Status', value: 'Online', color: 'green' }
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
    <div className="campus-home">
      {/* ── NAV ── */}
      <header className="campus-hero">
        <nav className="campus-nav">
          <div className="campus-brand">
            <div className="brand-mark">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <p className="brand-label">Smart Campus Platform</p>
              <h1>Campus Services</h1>
            </div>
          </div>

          <div className="campus-nav-links">
            <a href="#modules" className="nav-item">Modules</a>
            <a href="#flow" className="nav-item">How It Works</a>
            <Link to="/resources" className="nav-item">Facilities</Link>
            <NotificationPanel />
            {currentUser && (
              <div className="nav-user-chip">
                <User size={14} />
                <span>{currentUser.fullName}</span>
                {currentUser.role && (
                  <span className="role-pill">{currentUser.role}</span>
                )}
              </div>
            )}
            <Link to="/alltickets" className="nav-cta">
              <Ticket size={15} /> Ticketing
            </Link>
            <button type="button" className="nav-signout" onClick={handleSignOut}>
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="hero-layout">
          <section className="hero-copy">
            <span className="hero-badge">✦ Integrated student and staff service portal</span>
            <h2>One platform for <em>every</em> campus service.</h2>
            <p>
              Manage facilities, bookings, and maintenance tickets from a single unified hub.
              Designed for students, staff, and administrators to act fast and stay informed.
            </p>

            <div className="hero-actions">
              <Link to="/createticket" className="primary-action">
                <ClipboardPlus size={18} /> Report an Issue
              </Link>
              <Link to="/resources" className="secondary-action">
                <Building2 size={18} /> Explore Facilities
              </Link>
              {isAdmin && (
                <Link to="/create-resource" className="secondary-action">
                  <Building2 size={18} /> Add Resource
                </Link>
              )}
              <Link to="/allbookings" className="secondary-action">
                <CalendarCheck size={18} /> View Bookings
              </Link>
              <Link to="/alltickets" className="secondary-action">
                <Ticket size={18} /> Ticket Dashboard
              </Link>
            </div>

            {/* Stats strip */}
            <div className="hero-stats">
              {stats.map(s => (
                <div key={s.label} className={`stat-chip stat-${s.color}`}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="hero-panel">
            <div className="panel-card live-card">
              <div className="panel-header">
                <ShieldCheck size={16} />
                <span>System Status</span>
                <span className="status-dot" />
              </div>
              <h3>All Systems Operational</h3>
              <p>Ticketing, Facilities, and Booking are live and connected.</p>
            </div>

            <div className="panel-grid">
              <div className="panel-card mini-card accent-amber-card">
                <Building2 size={20} />
                <span>Facilities</span>
              </div>
              <div className="panel-card mini-card accent-teal-card">
                <CalendarCheck size={20} />
                <span>Bookings</span>
              </div>
              <div className="panel-card mini-card accent-rose-card">
                <Wrench size={20} />
                <span>Ticketing</span>
              </div>
            </div>
          </aside>
        </div>
      </header>

      {/* ── MODULES ── */}
      <main className="campus-main">
        <section className="module-section" id="modules">
          <div className="section-heading">
            <p className="section-kicker">Active modules</p>
            <h3>Three integrated systems, one campus experience</h3>
            <p>
              Each module is independently owned but shares the same platform so actions
              flow naturally from discovery to booking to maintenance.
            </p>
          </div>

          <div className="module-grid">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.id} className={`module-card accent-${module.accent}`}>
                  <div className="module-top">
                    <div className={`module-icon icon-${module.accent}`}>
                      <Icon size={24} />
                    </div>
                    <span className="module-status live-badge">● {module.status}</span>
                  </div>

                  <p className="module-owner">{module.owner}</p>
                  <h4>{module.title}</h4>
                  <p className="module-description">{module.description}</p>

                  <div className="module-actions">
                    {module.actions
                      .filter((action) => !action.roles || action.roles.includes(currentUser?.role))
                      .map((action) => (
                        <Link
                          key={action.to}
                          to={action.to}
                          className={action.primary ? 'module-link primary' : 'module-link'}
                        >
                          {action.label}
                          <ArrowRight size={15} />
                        </Link>
                      ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── FLOW ── */}
        <section className="flow-section" id="flow">
          <div className="section-heading">
            <p className="section-kicker">System flow</p>
            <h3>A simple journey across the smart campus experience</h3>
          </div>

          <div className="journey-grid">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="journey-card">
                  <div className="journey-top">
                    <span className="journey-number">0{index + 1}</span>
                    <div className="journey-icon">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;


