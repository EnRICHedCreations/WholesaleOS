-- Create markets table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_markets_user_id ON markets(user_id);
CREATE INDEX IF NOT EXISTS idx_markets_is_active ON markets(is_active);
CREATE INDEX IF NOT EXISTS idx_markets_user_active ON markets(user_id, is_active);

-- Add comment
COMMENT ON TABLE markets IS 'User-defined markets to monitor for property listings';
