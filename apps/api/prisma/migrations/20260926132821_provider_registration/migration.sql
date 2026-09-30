-- AlterEnum
ALTER TYPE "ProviderStatus" ADD VALUE 'rejected';

-- AlterTable
ALTER TABLE "ServiceProvider" ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3);
