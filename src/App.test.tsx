import { render, screen } from '@testing-library/react';
import App from './App.tsx';
import '@testing-library/jest-dom';

describe('App Component', () => {
    it('renders App component', () => {
      render(<App />);
      const linkElement = screen.getByText(/SpaceX Launchpads/i);
      expect(linkElement).toBeInTheDocument();
    });
  });
