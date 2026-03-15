import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../components/shared/Footer';

describe('Footer Component', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getAllByText(/Tessa Kline/i).length).toBeGreaterThan(0);
  });
});
