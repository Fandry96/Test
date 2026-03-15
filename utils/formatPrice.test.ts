import { describe, it, expect } from 'vitest';
import { formatPrice } from '../../lib/utils';

describe('formatPrice', () => {
  it('formats positive numbers correctly', () => {
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(1000)).toBe('$1,000.00');
  });

  it('formats zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats negative numbers correctly', () => {
    expect(formatPrice(-50)).toBe('-$50.00');
    expect(formatPrice(-1500)).toBe('-$1,500.00');
  });

  it('formats millions correctly', () => {
    expect(formatPrice(1500000)).toBe('$1,500,000.00');
    expect(formatPrice(10000000)).toBe('$10,000,000.00');
  });

  it('formats decimals correctly', () => {
    expect(formatPrice(100.5)).toBe('$100.50');
    expect(formatPrice(100.99)).toBe('$100.99');
    expect(formatPrice(100.999)).toBe('$101.00');
  });
});
