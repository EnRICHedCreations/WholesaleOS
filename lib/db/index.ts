import { sql } from '@vercel/postgres';

export { sql };

// Helper function to handle database errors
export function handleDbError(error: unknown, operation: string): never {
  console.error(`Database error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}`);
}
