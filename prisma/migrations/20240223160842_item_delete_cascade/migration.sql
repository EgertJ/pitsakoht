-- DropForeignKey
ALTER TABLE `itemaddon` DROP FOREIGN KEY `ItemAddon_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `itemingredient` DROP FOREIGN KEY `ItemIngredient_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_itemId_fkey`;

-- DropForeignKey
ALTER TABLE `size` DROP FOREIGN KEY `Size_itemId_fkey`;

-- AddForeignKey
ALTER TABLE `ItemIngredient` ADD CONSTRAINT `ItemIngredient_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemAddon` ADD CONSTRAINT `ItemAddon_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Size` ADD CONSTRAINT `Size_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
