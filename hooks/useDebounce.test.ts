/**
 * @vitest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from '../../lib/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should not update value before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500 });

    // Fast-forward time but not enough
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(result.current).toBe('initial'); // still initial
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should reset timer if value changes before delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated1', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    rerender({ value: 'updated2', delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // At this point, total time is 500ms since the first update,
    // but the timer should have been reset by the second update.
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Now 500ms has passed since the *second* update.
    expect(result.current).toBe('updated2');
  });

  it('should cancel timeout on unmount', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // value should still be initial because the component unmounted and timeout was cleared
    expect(result.current).toBe('initial');
  });
});
