/*
  Warnings:

  - Added the required column `quantity` to the `OrderItemAddon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orderitemaddon` ADD COLUMN `quantity` INTEGER NOT NULL;
