import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import { useAuth } from '../../features/auth/AuthContext';
import React from 'react';

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock useAuth
vi.mock('../../features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('AdminRoute Guard', () => {
  it('redirects non-admin users', () => {
    (useAuth as any).mockReturnValue({
      user: { app_metadata: { role: 'user' } },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home Page')).toBeDefined();
    expect(screen.queryByText('Admin Dashboard')).toBeNull();
  });

  it('allows admin users', () => {
    (useAuth as any).mockReturnValue({
      user: { app_metadata: { role: 'admin' } },
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Dashboard')).toBeDefined();
  });
});