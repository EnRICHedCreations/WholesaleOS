-- Create properties table
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_property_id ON properties(property_id);
CREATE INDEX IF NOT EXISTS idx_properties_market_id ON properties(market_id);
CREATE INDEX IF NOT EXISTS idx_properties_investment_score ON properties(investment_score DESC);
CREATE INDEX IF NOT EXISTS idx_properties_list_date ON properties(list_date DESC);
CREATE INDEX IF NOT EXISTS idx_properties_market_score ON properties(market_id, investment_score DESC);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Add comment
COMMENT ON TABLE properties IS 'Scraped property listings with investment scores';
