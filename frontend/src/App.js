import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import CreateTicket from './components/CreateTicket/CreateTicket';
import TicketList from './components/TicketList/TicketList';
import TicketDetails from './components/TicketDetails/TicketDetails';
import ResourceList from "./components/ResourceList/ResourceList";
import CreateResource from "./components/CreateResource/CreateResource";
import EditResource from "./components/EditResource/EditResource";

function App() {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createticket" element={<CreateTicket />} />
          <Route path="/alltickets" element={<TicketList />} />
          <Route path="/ticketdetails/:id" element={<TicketDetails />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/edit-resource/:id" element={<EditResource />} />
          <Route path="/create-resource" element={<CreateResource />} />
        </Routes>
      </React.Fragment>
    </div>
  );
}

export default App;
