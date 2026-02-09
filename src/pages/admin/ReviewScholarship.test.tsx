import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewScholarship from './ReviewScholarship';
import { updateScholarship } from '../../features/scholarships/api';
import React from 'react';

// Mock Router
vi.mock('react-router-dom', () => ({
  useParams: () => ({ id: '123' }),
  useNavigate: () => vi.fn()
}));

// Mock API
vi.mock('../../features/scholarships/api', () => ({
  getScholarshipById: vi.fn(() => Promise.resolve({
    id: '123',
    title: 'Test Scholarship',
    status: 'PENDING_REVIEW'
  })),
  updateScholarship: vi.fn(() => Promise.resolve())
}));

// Mock Translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

describe('ReviewScholarship Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scholarship details', async () => {
    render(<ReviewScholarship />);
    expect(await screen.findByDisplayValue('Test Scholarship')).toBeDefined();
  });

  it('calls updateScholarship with PUBLISHED status on publish', async () => {
    render(<ReviewScholarship />);
    await screen.findByDisplayValue('Test Scholarship');

    const publishTrigger = screen.getByText('approvePublish');
    fireEvent.click(publishTrigger);

    const confirmButton = await screen.findByText('Publish');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(updateScholarship).toHaveBeenCalledWith('123', expect.objectContaining({
        status: 'PUBLISHED'
      }));
    });
  });

  it('calls updateScholarship with REJECTED status on reject', async () => {
    render(<ReviewScholarship />);
    await screen.findByDisplayValue('Test Scholarship');

    const rejectTrigger = screen.getByText('reject');
    fireEvent.click(rejectTrigger);

    const buttons = await screen.findAllByText('reject');
    const confirmButton = buttons[buttons.length - 1]; 
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(updateScholarship).toHaveBeenCalledWith('123', expect.objectContaining({
        status: 'REJECTED'
      }));
    });
  });
});
