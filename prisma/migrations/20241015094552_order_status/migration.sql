/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` ADD COLUMN `orderNumber` VARCHAR(191) NULL,
    ADD COLUMN `orderStatus` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `orders_orderNumber_key` ON `orders`(`orderNumber`);
