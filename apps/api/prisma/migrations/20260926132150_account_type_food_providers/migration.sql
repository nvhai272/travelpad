-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('traveler', 'provider');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProviderType" ADD VALUE 'restaurant';
ALTER TYPE "ProviderType" ADD VALUE 'cafe';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'traveler';
