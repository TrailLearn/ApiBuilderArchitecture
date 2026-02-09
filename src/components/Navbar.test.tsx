import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../features/auth/AuthContext';
import React from 'react';

// Correct mock for react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  }
}));

// Mock useAuth
vi.mock('../features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Navbar Component', () => {
  it('shows Sign In button when logged out', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('login')).toBeDefined();
  });

  it('shows user email and logout when logged in', () => {
    (useAuth as any).mockReturnValue({
      user: { email: 'user@test.com' },
      loading: false,
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('user@test.com')).toBeDefined();
    expect(screen.getByText('logout')).toBeDefined();
  });
});