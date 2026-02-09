import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '../../supabaseClient';
import React from 'react';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signOut: vi.fn(),
    }
  }
}));

const TestComponent = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading</div>;
  return <div>{user ? `User: ${user.email}` : 'No User'}</div>;
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides user session when authenticated', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: { user: { email: 'test@example.com' } } }
    });

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('User: test@example.com')).toBeDefined();
    });
  });

  it('provides null when not authenticated', async () => {
    (supabase.auth.getSession as any).mockResolvedValue({
      data: { session: null }
    });

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('No User')).toBeDefined();
    });
  });
});
