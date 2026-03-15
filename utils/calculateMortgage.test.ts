import { describe, it, expect } from 'vitest';
import { calculateMortgage } from '../../lib/utils/calculateMortgage';

describe('calculateMortgage', () => {
  it('should calculate mortgage correctly with positive values', () => {
    const result = calculateMortgage(200000, 5, 30);
    expect(result).toBeCloseTo(1073.64, 2);
  });

  it('should return 0 when principal is 0', () => {
    const result = calculateMortgage(0, 5, 30);
    expect(result).toBe(0);
  });

  it('should return 0 when principal is negative', () => {
    const result = calculateMortgage(-200000, 5, 30);
    expect(result).toBe(0);
  });

  it('should handle zero interest rate correctly', () => {
    const result = calculateMortgage(240000, 0, 20);
    expect(result).toBe(1000);
  });

  it('should return 0 when years is 0 or negative', () => {
    const resultZero = calculateMortgage(200000, 5, 0);
    expect(resultZero).toBe(0);

    const resultNegative = calculateMortgage(200000, 5, -30);
    expect(resultNegative).toBe(0);
  });
});
