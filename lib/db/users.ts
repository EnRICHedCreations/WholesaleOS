import { sql } from './index';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  alert_threshold: number;
  email_alerts: boolean;
  quiet_hours_start: number | null;
  quiet_hours_end: number | null;
  created_at: Date;
}

/**
 * Create a new user with hashed password
 */
export async function createUser(
  email: string,
  password: string,
  name?: string
): Promise<User> {
  try {
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await sql`
      INSERT INTO users (email, password_hash, name, created_at, updated_at)
      VALUES (${email}, ${password_hash}, ${name || null}, NOW(), NOW())
      RETURNING id, email, password_hash, name, created_at, updated_at
    `;

    const user = result.rows[0] as User;

    // Create default preferences
    await sql`
      INSERT INTO user_preferences (user_id, alert_threshold, email_alerts, created_at)
      VALUES (${user.id}, 80, true, NOW())
    `;

    return user;
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation
      throw new Error('Email already exists');
    }
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

/**
 * Find user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, password_hash, name, created_at, updated_at
      FROM users
      WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as User;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error('Failed to get user');
  }
}

/**
 * Find user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  try {
    const result = await sql`
      SELECT id, email, password_hash, name, created_at, updated_at
      FROM users
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error('Failed to get user');
  }
}

/**
 * Verify user password
 */
export async function verifyPassword(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Failed to verify password');
  }
}

/**
 * Update user name
 */
export async function updateUserName(
  userId: number,
  name: string
): Promise<void> {
  try {
    await sql`
      UPDATE users
      SET name = ${name}, updated_at = NOW()
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error('Error updating user name:', error);
    throw new Error('Failed to update user name');
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: number,
  newPassword: string
): Promise<void> {
  try {
    const password_hash = await bcrypt.hash(newPassword, 10);

    await sql`
      UPDATE users
      SET password_hash = ${password_hash}, updated_at = NOW()
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw new Error('Failed to update password');
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(
  userId: number
): Promise<UserPreferences | null> {
  try {
    const result = await sql`
      SELECT id, user_id, alert_threshold, email_alerts, quiet_hours_start, quiet_hours_end, created_at
      FROM user_preferences
      WHERE user_id = ${userId}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as UserPreferences;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw new Error('Failed to get user preferences');
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: number,
  preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at'>>
): Promise<void> {
  try {
    const updates: string[] = [];
    const values: any[] = [];

    if (preferences.alert_threshold !== undefined) {
      updates.push(`alert_threshold = $${values.length + 1}`);
      values.push(preferences.alert_threshold);
    }

    if (preferences.email_alerts !== undefined) {
      updates.push(`email_alerts = $${values.length + 1}`);
      values.push(preferences.email_alerts);
    }

    if (preferences.quiet_hours_start !== undefined) {
      updates.push(`quiet_hours_start = $${values.length + 1}`);
      values.push(preferences.quiet_hours_start);
    }

    if (preferences.quiet_hours_end !== undefined) {
      updates.push(`quiet_hours_end = $${values.length + 1}`);
      values.push(preferences.quiet_hours_end);
    }

    if (updates.length === 0) {
      return;
    }

    await sql.query(
      `UPDATE user_preferences SET ${updates.join(', ')} WHERE user_id = $${values.length + 1}`,
      [...values, userId]
    );
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw new Error('Failed to update preferences');
  }
}

/**
 * Delete user account (cascades to all related data)
 */
export async function deleteUser(userId: number): Promise<void> {
  try {
    await sql`
      DELETE FROM users
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}
