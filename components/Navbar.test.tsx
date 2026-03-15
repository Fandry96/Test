import { render, screen } from '@testing-library/react';
import Navbar from '../../components/shared/Navbar';

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    render(<Navbar />);
    const navbarElement = screen.getByTestId('navbar');
    expect(navbarElement).toBeInTheDocument();
  });
});
