import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../../features/auth/AuthContext';
import React from 'react';

// Mock Supabase
vi.mock('../../supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    }
  }
}));

// Mock Supabase Auth UI
vi.mock('@supabase/auth-ui-react', () => ({
  Auth: () => <div data-testid="supabase-auth-ui">Auth UI</div>
}));

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Login Page', () => {
  it('renders auth ui component', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('welcome')).toBeDefined();
    expect(screen.getByTestId('supabase-auth-ui')).toBeDefined();
  });
});