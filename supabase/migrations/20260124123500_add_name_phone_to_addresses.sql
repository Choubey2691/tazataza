-- Add name and phone columns to addresses table
ALTER TABLE addresses ADD COLUMN name text NOT NULL;
ALTER TABLE addresses ADD COLUMN phone text NOT NULL;
