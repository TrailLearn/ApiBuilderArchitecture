import { describe, it, expect, vi } from 'vitest';
import { getPublishedScholarships } from './api';

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
    expect(data[0].status).toEqual('PUBLISHED');
  });
});
