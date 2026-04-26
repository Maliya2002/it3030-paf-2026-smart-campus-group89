import React from 'react';
import { Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Home from './components/Home/Home';
import CreateTicket from './components/CreateTicket/CreateTicket';
import TicketList from './components/TicketList/TicketList';
import TicketDetails from './components/TicketDetails/TicketDetails';
import ResourceList from './components/ResourceList/ResourceList';
import CreateResource from './components/CreateResource/CreateResource';
import EditResource from './components/EditResource/EditResource';
import { isAuthenticated } from './utils/auth';

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/home" replace /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={isAuthenticated() ? <Navigate to="/home" replace /> : <SignUp />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/createticket" element={<CreateTicket />} />
            <Route path="/alltickets" element={<TicketList />} />
            <Route path="/ticketdetails/:id" element={<TicketDetails />} />
            <Route path="/resources" element={<ResourceList />} />
            <Route path="/create-resource" element={<CreateResource />} />
            <Route path="/edit-resource/:id" element={<EditResource />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={isAuthenticated() ? '/home' : '/'} replace />}
          />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
