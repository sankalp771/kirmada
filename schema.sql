-- Enable extension for UUIDs if needed later
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables for fresh schema migration
DROP TABLE IF EXISTS infections, predictions, schisms, feedback, events, doctrine_versions, prophets, ideologies CASCADE;


-- 1. Create Table: ideologies
CREATE TABLE IF NOT EXISTS ideologies (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    theme VARCHAR(255),
    founder_prophet_id VARCHAR(255),
    doctrine TEXT,
    doctrine_version INT DEFAULT 1,
    followers INT DEFAULT 0,
    reputation INT DEFAULT 0,
    treasury NUMERIC(18, 6) DEFAULT 0.0
);

-- 2. Create Table: prophets
CREATE TABLE IF NOT EXISTS prophets (
    id VARCHAR(255) PRIMARY KEY,
    ideology_id VARCHAR(255) REFERENCES ideologies(id) ON DELETE SET NULL,
    personality TEXT NOT NULL,
    history TEXT NOT NULL,
    goal TEXT NOT NULL,
    special_ability VARCHAR(255),
    erc8004_token_id VARCHAR(255)
);

-- Circular reference constraint on ideologies
ALTER TABLE ideologies DROP CONSTRAINT IF EXISTS fk_founder_prophet;
ALTER TABLE ideologies 
ADD CONSTRAINT fk_founder_prophet 
FOREIGN KEY (founder_prophet_id) REFERENCES prophets(id) ON DELETE SET NULL;

-- 3. Create Table: doctrine_versions
CREATE TABLE IF NOT EXISTS doctrine_versions (
    id SERIAL PRIMARY KEY,
    ideology_id VARCHAR(255) NOT NULL REFERENCES ideologies(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Table: events
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- 'join' | 'doctrine_change' | 'schism' | 'alliance'
    ideology_id VARCHAR(255) REFERENCES ideologies(id) ON DELETE CASCADE,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Table: feedback
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    ideology_id VARCHAR(255) NOT NULL REFERENCES ideologies(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Table: schisms
CREATE TABLE IF NOT EXISTS schisms (
    id SERIAL PRIMARY KEY,
    parent_ideology_id VARCHAR(255) REFERENCES ideologies(id) ON DELETE SET NULL,
    new_ideology_id VARCHAR(255) REFERENCES ideologies(id) ON DELETE SET NULL,
    justification TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for speed in high-frequency queries
CREATE INDEX IF NOT EXISTS idx_prophets_ideology ON prophets(ideology_id);
CREATE INDEX IF NOT EXISTS idx_doctrine_versions_ideology ON doctrine_versions(ideology_id);
CREATE INDEX IF NOT EXISTS idx_events_ideology ON events(ideology_id);
CREATE INDEX IF NOT EXISTS idx_feedback_ideology ON feedback(ideology_id);

-- 7. Create Table: predictions
CREATE TABLE IF NOT EXISTS predictions (
    prophet_id VARCHAR(255) NOT NULL,
    conversation_id VARCHAR(255) NOT NULL,
    prediction_text TEXT NOT NULL,
    trigger_keyword VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (prophet_id, conversation_id, trigger_keyword)
);

-- 8. Create Table: infections
CREATE TABLE IF NOT EXISTS infections (
    conversation_id VARCHAR(255) NOT NULL,
    prophet_id VARCHAR(255) NOT NULL,
    level INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'inactive',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, prophet_id)
);
