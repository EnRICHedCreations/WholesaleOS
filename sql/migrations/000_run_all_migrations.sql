-- ========================================
-- WholesaleOS Elite - Complete Database Schema
-- Run this file in Neon SQL Editor to create all tables
-- ========================================

-- Migration 001: Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
COMMENT ON TABLE users IS 'User accounts for WholesaleOS Elite';

-- Migration 002: Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    alert_threshold INTEGER DEFAULT 80 CHECK (alert_threshold >= 0 AND alert_threshold <= 100),
    email_alerts BOOLEAN DEFAULT true,
    quiet_hours_start INTEGER CHECK (quiet_hours_start >= 0 AND quiet_hours_start <= 23),
    quiet_hours_end INTEGER CHECK (quiet_hours_end >= 0 AND quiet_hours_end <= 23),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
COMMENT ON TABLE user_preferences IS 'User notification and alert preferences';

-- Migration 003: Create markets table
CREATE TABLE IF NOT EXISTS markets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    preset VARCHAR(50),

    -- Price filters
    price_min INTEGER,
    price_max INTEGER,

    -- Bedroom/bathroom filters
    beds_min INTEGER,
    beds_max INTEGER,
    baths_min DECIMAL(3,1),
    baths_max DECIMAL(3,1),

    -- Size filters
    sqft_min INTEGER,
    sqft_max INTEGER,
    lot_sqft_min INTEGER,
    lot_sqft_max INTEGER,

    -- Year built filters
    year_built_min INTEGER,
    year_built_max INTEGER,

    -- Additional property filters
    hoa_fee_max INTEGER,
    stories_min INTEGER,
    stories_max INTEGER,
    garage_spaces_min INTEGER,

    -- Boolean filters
    has_pool BOOLEAN,
    has_garage BOOLEAN,
    waterfront BOOLEAN,
    has_view BOOLEAN,

    -- Status and timestamps
    is_active BOOLEAN DEFAULT true,
    last_scraped_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_markets_user_id ON markets(user_id);
CREATE INDEX IF NOT EXISTS idx_markets_is_active ON markets(is_active);
CREATE INDEX IF NOT EXISTS idx_markets_user_active ON markets(user_id, is_active);
COMMENT ON TABLE markets IS 'User-defined markets to monitor for property listings';

-- Migration 004: Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    property_id VARCHAR(255) UNIQUE NOT NULL,
    market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,

    -- Address information
    full_street_line TEXT,
    city VARCHAR(255),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    county VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Property details
    beds INTEGER,
    full_baths INTEGER,
    half_baths INTEGER,
    baths DECIMAL(3,1),
    sqft INTEGER,
    lot_sqft INTEGER,
    year_built INTEGER,
    stories INTEGER,
    parking_garage INTEGER,

    -- Financial information
    hoa_fee DECIMAL(10, 2),
    list_price DECIMAL(12, 2),
    price_per_sqft DECIMAL(10, 2),
    sold_price DECIMAL(12, 2),
    estimated_value DECIMAL(12, 2),
    assessed_value DECIMAL(12, 2),
    property_age INTEGER,
    price_discount DECIMAL(5, 2),

    -- Listing information
    list_date TIMESTAMP,
    days_on_mls INTEGER,

    -- Investment scores
    investment_score DECIMAL(5, 2),
    investment_score_price DECIMAL(5, 2),
    investment_score_discount DECIMAL(5, 2),
    investment_score_dom DECIMAL(5, 2),
    investment_score_lot DECIMAL(5, 2),

    -- Agent/Broker information
    agent_name VARCHAR(255),
    agent_email VARCHAR(255),
    agent_phone VARCHAR(50),
    broker_name VARCHAR(255),

    -- MLS information
    mls_id VARCHAR(100),
    mls_status VARCHAR(50),

    -- Media and metadata
    primary_photo TEXT,
    photos JSONB,
    tags JSONB,
    description_text TEXT,
    raw_data JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_property_id ON properties(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_market_id ON properties(market_id);
CREATE INDEX IF NOT EXISTS idx_properties_investment_score ON properties(investment_score DESC);
CREATE INDEX IF NOT EXISTS idx_properties_list_date ON properties(list_date DESC);
CREATE INDEX IF NOT EXISTS idx_properties_market_score ON properties(market_id, investment_score DESC);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
COMMENT ON TABLE properties IS 'Scraped property listings with investment scores';

-- Migration 005: Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    sent_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_property_id ON alerts(property_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
COMMENT ON TABLE alerts IS 'High-score property alerts sent to users';

-- ========================================
-- Verification Query
-- Run this after migrations to verify all tables were created
-- ========================================
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_catalog.pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY tablename;
