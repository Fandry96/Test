import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BiophilicButton } from '../../components/ui/BiophilicButton';

describe('BiophilicButton', () => {
  it('fires click handler when clicked', async () => {
    const handleClick = vi.fn();
    render(<BiophilicButton onClick={handleClick}>Click Me</BiophilicButton>);

    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
