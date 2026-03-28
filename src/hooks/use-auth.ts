import { db } from '@/lib/db';

export function useAuth() {
  return db.useAuth();
}
