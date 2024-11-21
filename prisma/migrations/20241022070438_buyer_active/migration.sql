/*
  Warnings:

  - You are about to alter the column `orderStatus` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `buyer` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `depositeAt` DATETIME(3) NULL,
    MODIFY `deposite` DOUBLE NULL DEFAULT 0.0,
    MODIFY `orderStatus` ENUM('onprocess', 'complete', 'cancle') NOT NULL DEFAULT 'onprocess';
