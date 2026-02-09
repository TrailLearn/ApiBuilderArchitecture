import { describe, it, expect, vi } from 'vitest';
import { getPublishedScholarships } from './api';
import { supabase } from '../../supabaseClient';

// Mock du module supabaseClient
vi.mock('../../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: [
              { id: '1', title: 'Test Scholarship', status: 'PUBLISHED' }
            ], 
            error: null 
          }))
        }))
      }))
    }))
  }
}));

describe('Scholarships API', () => {
  it('should fetch published scholarships', async () => {
    const data = await getPublishedScholarships();
    expect(data).toHaveLength(1);
    expect(data[0].title).toEqual('Test Scholarship');
  });

  it('should handle errors gracefully', async () => {
    // Mock temporary error
    (supabase.from as any).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: { message: 'DB Error' } }))
        }))
      }))
    }));

    await expect(getPublishedScholarships()).rejects.toThrow('Failed to load scholarships: DB Error');
  });
});