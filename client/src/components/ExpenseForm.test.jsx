import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseForm from './ExpenseForm.jsx';

// Stub the ML hook so the form does not try to hit the network
vi.mock('../hooks/useCategorySuggestion.js', () => ({
  useCategorySuggestion: () => null,
}));

describe('ExpenseForm', () => {
  it('renders amount, category, date, and note fields', () => {
    render(<ExpenseForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
  });

  it('disables submit when amount is empty', () => {
    render(<ExpenseForm onSubmit={() => {}} />);
    const button = screen.getByRole('button', { name: /add transaction/i });
    expect(button).toBeDisabled();
  });

  it('shows validation error for negative amount on blur', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm onSubmit={() => {}} />);
    const amount = screen.getByLabelText(/Amount/i);
    await user.type(amount, '-5');
    await user.tab();
    expect(screen.getByText(/greater than 0/i)).toBeInTheDocument();
  });

  it('calls onSubmit with parsed payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ExpenseForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Amount/i), '15.75');
    await user.type(screen.getByLabelText(/Note/i), 'coffee');

    const button = screen.getByRole('button', { name: /add transaction/i });
    await user.click(button);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.amount).toBe(15.75);
    expect(payload.note).toBe('coffee');
    expect(payload.category).toBe('Food');
    expect(payload.date).toMatch(/T/);
  });
});
