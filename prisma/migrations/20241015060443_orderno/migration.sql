/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `product_id` on the `product_images` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `product_id` on the `shippingprice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `product_images` DROP FOREIGN KEY `product_images_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `shippingprice` DROP FOREIGN KEY `ShippingPrice_product_id_fkey`;

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `product_images` MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `shippingprice` MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `isVerify` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingPrice` ADD CONSTRAINT `ShippingPrice_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
