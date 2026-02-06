import { fetchFromLaravel } from './api-client';
import type { User } from '@/types';

// Get current user from Laravel API
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetchFromLaravel<{ success: boolean; data: { user: User | null } }>('/api/auth/session');
    
    if (response.success && response.data?.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

// Require authentication (throws if not authenticated)
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

// Require admin role (throws if not admin)
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
}
