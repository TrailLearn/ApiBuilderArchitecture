import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from './Dashboard';
import React from 'react';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    })),
    rpc: vi.fn()
  }
}));

// Mock toast
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

// Mock translation to return keys
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Admin Dashboard', () => {
  it('renders the dashboard title and sections', () => {
    render(<AdminDashboard />);
    // Checking for translation keys since that's what our mock returns
    expect(screen.getByText('title')).toBeDefined();
    expect(screen.getByText('userManagement')).toBeDefined();
    expect(screen.getByText(/pendingTitle/)).toBeDefined();
  });
});