-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('pending', 'processing', 'completed', 'delivered') NOT NULL;
