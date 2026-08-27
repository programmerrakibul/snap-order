/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestockRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestockRequestItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "RestockRequest" DROP CONSTRAINT "RestockRequest_stockedById_fkey";

-- DropForeignKey
ALTER TABLE "RestockRequestItem" DROP CONSTRAINT "RestockRequestItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "RestockRequestItem" DROP CONSTRAINT "RestockRequestItem_restockRequestId_fkey";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "RestockRequest";

-- DropTable
DROP TABLE "RestockRequestItem";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "RestockStatus";

-- DropEnum
DROP TYPE "Role";
