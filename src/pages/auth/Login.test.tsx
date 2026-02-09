import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock Supabase Auth UI
vi.mock('@supabase/auth-ui-react', () => ({
  Auth: () => <div data-testid="supabase-auth-ui">Auth UI</div>
}));

describe('Login Page', () => {
  it('renders auth ui component', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByText('Bienvenue')).toBeDefined();
    expect(screen.getByTestId('supabase-auth-ui')).toBeDefined();
  });
});
