// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FileUpload from '../components/FileUpload';
import UserFeedbackForm from '../UserFeedbackForm';

describe('Frontend Component Test Suite', () => {

  beforeEach(() => {
    // Mock global fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Thank you for your feedback!' }),
    });
  });

  it('renders FileUpload component heading and upload zone', () => {
    render(<FileUpload />);
    expect(screen.getByText(/drag & drop your file here/i)).toBeInTheDocument();
  });

  it('updates file state when a file is selected', () => {
    const { container } = render(<FileUpload />);
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    
    const input = container.querySelector('input[type="file"]') || 
                  screen.queryByTestId('file-input') || 
                  screen.getByLabelText(/browse/i);

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText(/hello.png/i)).toBeInTheDocument();
  });

  it('shows validation error on Feedback Form when submitted empty', async () => {
    render(<UserFeedbackForm />);
    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  it('allows user to type name and feedback message', () => {
    render(<UserFeedbackForm />);
    
    const nameInput = screen.queryByPlaceholderText(/your name/i) || 
                      screen.getByPlaceholderText(/e\.g\. ubaidullah/i);

    fireEvent.change(nameInput, { target: { value: 'Ubaidullah' } });
    expect(nameInput.value).toBe('Ubaidullah');
  });

  it('submits feedback successfully when fields are valid', async () => {
    const { container } = render(<UserFeedbackForm />);

    const nameInput = screen.queryByPlaceholderText(/your name/i) || 
                      screen.getByPlaceholderText(/e\.g\. ubaidullah/i);
    fireEvent.change(nameInput, { target: { value: 'Ubaidullah' } });

    const emailInput = container.querySelector('input[type="email"]');
    if (emailInput) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    }

    const categorySelect = container.querySelector('select');
    if (categorySelect) {
      fireEvent.change(categorySelect, { target: { value: categorySelect.options[1]?.value || 'UI UX Bug' } });
    }

    const dateInput = container.querySelector('input[type="date"]');
    if (dateInput) {
      fireEvent.change(dateInput, { target: { value: '2026-07-26' } });
    }

    const fileInput = container.querySelector('input[type="file"]');
    if (fileInput) {
      const file = new File(['dummy content'], 'screenshot.png', { type: 'image/png' });
      fireEvent.change(fileInput, { target: { files: [file] } });
    }

    const feedbackInput = screen.getByPlaceholderText(/describe your feedback/i);
    fireEvent.change(feedbackInput, { target: { value: 'Great SaaS platform for analytics!' } });

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/thank you for your feedback/i)).toBeInTheDocument();
    });
  });

});
