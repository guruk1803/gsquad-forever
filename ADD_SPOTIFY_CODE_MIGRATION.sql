-- Add spotify_code column to existing celebrations table
-- Run this in Neon SQL Editor if you already have the table

ALTER TABLE celebrations 
ADD COLUMN IF NOT EXISTS spotify_code TEXT;

-- Success message
SELECT '✅ Spotify code column added successfully!' as status;

