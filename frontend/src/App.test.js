import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders smart campus homepage', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Campus Services Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Maintenance & Incident Ticketing/i)).toBeInTheDocument();
});
