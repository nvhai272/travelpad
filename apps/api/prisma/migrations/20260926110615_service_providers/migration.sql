-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('hotel', 'guesthouse', 'homestay', 'resort', 'tour_guide', 'tour_operator', 'car_rental', 'motorbike_rental', 'shuttle');

-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('night', 'day', 'trip', 'person');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('pending', 'active', 'suspended');

-- CreateEnum
CREATE TYPE "ConnectRequestStatus" AS ENUM ('new', 'contacted', 'closed');

-- CreateTable
CREATE TABLE "ServiceProvider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "destinationId" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT NOT NULL,
    "priceFrom" INTEGER NOT NULL,
    "priceUnit" "PriceUnit" NOT NULL,
    "languages" TEXT[],
    "phone" TEXT NOT NULL,
    "zalo" TEXT,
    "website" TEXT,
    "coverUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProviderStatus" NOT NULL DEFAULT 'pending',
    "ownerId" TEXT,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectRequest" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "travelDate" TIMESTAMP(3),
    "people" INTEGER,
    "contactPhone" TEXT,
    "status" "ConnectRequestStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceProvider_slug_key" ON "ServiceProvider"("slug");

-- CreateIndex
CREATE INDEX "ServiceProvider_destinationId_type_status_idx" ON "ServiceProvider"("destinationId", "type", "status");

-- CreateIndex
CREATE INDEX "ConnectRequest_providerId_status_createdAt_idx" ON "ConnectRequest"("providerId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ConnectRequest_userId_createdAt_idx" ON "ConnectRequest"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceProvider" ADD CONSTRAINT "ServiceProvider_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectRequest" ADD CONSTRAINT "ConnectRequest_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ServiceProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectRequest" ADD CONSTRAINT "ConnectRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
