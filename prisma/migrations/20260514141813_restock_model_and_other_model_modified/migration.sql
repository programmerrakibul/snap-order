-- CreateEnum
CREATE TYPE "RestockStatus" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastRestocked" TIMESTAMP(3),
ADD COLUMN     "maxThreshold" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "minThreshold" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "supplierId" TEXT,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "RestockRequest" (
    "id" TEXT NOT NULL,
    "status" "RestockStatus" NOT NULL DEFAULT 'PENDING',
    "stockedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),

    CONSTRAINT "RestockRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestockRequestItem" (
    "id" TEXT NOT NULL,
    "restockRequestId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestockRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestockRequest_status_idx" ON "RestockRequest"("status");

-- CreateIndex
CREATE INDEX "RestockRequest_createdAt_idx" ON "RestockRequest"("createdAt");

-- CreateIndex
CREATE INDEX "RestockRequest_stockedById_idx" ON "RestockRequest"("stockedById");

-- CreateIndex
CREATE INDEX "RestockRequestItem_restockRequestId_idx" ON "RestockRequestItem"("restockRequestId");

-- CreateIndex
CREATE INDEX "RestockRequestItem_productId_idx" ON "RestockRequestItem"("productId");

-- CreateIndex
CREATE INDEX "RestockRequestItem_createdAt_idx" ON "RestockRequestItem"("createdAt");

-- CreateIndex
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestockRequest" ADD CONSTRAINT "RestockRequest_stockedById_fkey" FOREIGN KEY ("stockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestockRequestItem" ADD CONSTRAINT "RestockRequestItem_restockRequestId_fkey" FOREIGN KEY ("restockRequestId") REFERENCES "RestockRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestockRequestItem" ADD CONSTRAINT "RestockRequestItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
