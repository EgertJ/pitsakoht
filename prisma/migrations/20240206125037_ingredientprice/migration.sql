/*
  Warnings:

  - You are about to drop the `_incredientstoitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `incredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_incredientstoitem` DROP FOREIGN KEY `_IncredientsToItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_incredientstoitem` DROP FOREIGN KEY `_IncredientsToItem_B_fkey`;

-- DropTable
DROP TABLE `_incredientstoitem`;

-- DropTable
DROP TABLE `incredients`;

-- CreateTable
CREATE TABLE `Incredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_IncredientToItem` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_IncredientToItem_AB_unique`(`A`, `B`),
    INDEX `_IncredientToItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_IncredientToItem` ADD CONSTRAINT `_IncredientToItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Incredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_IncredientToItem` ADD CONSTRAINT `_IncredientToItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
