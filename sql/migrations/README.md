# Database Migrations

This directory contains SQL migration files for the WholesaleOS Elite database schema.

## Running Migrations

Connect to your Vercel Postgres database and run each migration in order:

```sql
-- Run migrations in order
\i 001_create_users.sql
\i 002_create_user_preferences.sql
\i 003_create_markets.sql
\i 004_create_properties.sql
\i 005_create_alerts.sql
```

Or use the Vercel Postgres dashboard to execute each file.

## Migration Order

1. `001_create_users.sql` - User accounts
2. `002_create_user_preferences.sql` - User preferences and settings
3. `003_create_markets.sql` - Market monitoring configuration
4. `004_create_properties.sql` - Property listings data
5. `005_create_alerts.sql` - Alert tracking

## Schema Overview

```
users
  ├── user_preferences (1:1)
  ├── markets (1:many)
  └── alerts (1:many)

markets
  └── properties (1:many)

properties
  └── alerts (1:many)
```

## Notes

- All foreign keys have `ON DELETE CASCADE` to maintain referential integrity
- Indexes are created for common query patterns
- JSONB fields are used for flexible metadata storage
- Timestamps use `TIMESTAMP` type with `DEFAULT NOW()`
