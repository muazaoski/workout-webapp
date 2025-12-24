-- Migration: Add UserSettings table (if not exists)
-- Run this manually on production database

-- Create the UserSettings table
CREATE TABLE IF NOT EXISTS "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weightUnit" TEXT NOT NULL DEFAULT 'kg',
    "distanceUnit" TEXT NOT NULL DEFAULT 'km',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- Create unique index on userId
CREATE UNIQUE INDEX IF NOT EXISTS "UserSettings_userId_key" ON "UserSettings"("userId");

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'UserSettings_userId_fkey'
    ) THEN
        ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
