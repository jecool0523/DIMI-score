-- Add timer columns to events table
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS set_duration INTEGER DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS set_start_time BIGINT DEFAULT NULL;
