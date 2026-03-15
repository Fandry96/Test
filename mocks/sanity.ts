import { Listing, Agent } from '../../types/index';

// We don't have a Neighborhood interface in types/index.ts, so defining one based on the Sanity query
export interface Neighborhood {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export const mockListings: Listing[] = [
  {
    _id: 'listing-1',
    title: 'Modern Downtown Loft',
    slug: 'modern-downtown-loft',
    price: 850000,
    address: '123 Main St, Apt 4B',
    city: 'Metropolis',
    state: 'NY',
    zip: '10001',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1500,
    status: 'Active',
    description: 'A beautiful modern loft in the heart of downtown.',
    mainImage: 'https://example.com/images/loft.jpg',
    type: 'Luxury',
  },
  {
    _id: 'listing-2',
    title: 'Cozy Suburban Home',
    slug: 'cozy-suburban-home',
    price: 450000,
    address: '456 Oak Ln',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2000,
    status: 'Pending',
    description: 'Perfect family home with a large backyard.',
    mainImage: 'https://example.com/images/house.jpg',
    type: 'New Construction',
  },
];

export const mockNeighborhoods: Neighborhood[] = [
  {
    _id: 'neighborhood-1',
    name: 'Downtown',
    slug: 'downtown',
    description: 'The bustling heart of the city.',
    image: 'https://example.com/images/downtown.jpg',
  },
  {
    _id: 'neighborhood-2',
    name: 'Suburbs',
    slug: 'suburbs',
    description: 'Quiet, family-friendly neighborhoods.',
    image: 'https://example.com/images/suburbs.jpg',
  },
];

export const mockAgents: Agent[] = [
  {
    _id: 'agent-1',
    name: 'Jane Doe',
    slug: 'jane-doe',
    role: 'Senior Real Estate Agent',
    email: 'jane@example.com',
    phone: '555-123-4567',
    linkedin: 'https://linkedin.com/in/janedoe',
    image: 'https://example.com/images/jane.jpg',
    bio: [
      {
        _key: 'b1',
        _type: 'block',
        children: [
          {
            _key: 'c1',
            _type: 'span',
            marks: [],
            text: 'Jane has over 10 years of experience in real estate.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
  },
  {
    _id: 'agent-2',
    name: 'John Smith',
    slug: 'john-smith',
    role: 'Listing Specialist',
    email: 'john@example.com',
    phone: '555-987-6543',
    linkedin: 'https://linkedin.com/in/johnsmith',
    image: 'https://example.com/images/john.jpg',
    bio: [
      {
        _key: 'b2',
        _type: 'block',
        children: [
          {
            _key: 'c2',
            _type: 'span',
            marks: [],
            text: 'John is an expert at finding the perfect home for his clients.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
  },
];
