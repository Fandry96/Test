import React from 'react';
import { render } from '@testing-library/react';
import { PropertyCard } from '../../components/ui/PropertyCard';

// Mock Next.js Image component to prevent snapshot issues with variable source URLs or keys
jest.mock('next/image', () => {
  return function MockImage({ fill, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} data-fill={fill} alt={props.alt || 'mocked image'} />;
  };
});

// Mock the Zustand store so it doesn't try to use context/hooks incorrectly in a basic snapshot test
jest.mock('../../lib/store/useUIStore', () => ({
  useUIStore: jest.fn((selector) => {
    // Return a dummy function for the openCalculator action
    const mockState = {
      openCalculator: jest.fn(),
    };
    return selector(mockState);
  }),
}));

describe('PropertyCard', () => {
  it('renders correctly and matches snapshot', () => {
    const mockProps = {
      image: 'https://example.com/placeholder-property.jpg',
      title: 'The Seaside Villa',
      location: 'Malibu, CA',
      price: '$4,500,000',
      specs: '5 Bed | 6 Bath | 6,200 sqft',
      type: 'Luxury' as const,
    };

    const { container } = render(<PropertyCard {...mockProps} />);

    expect(container).toMatchSnapshot();
  });
});
