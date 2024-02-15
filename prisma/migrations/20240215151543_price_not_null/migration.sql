/*
  Warnings:

  - Made the column `price` on table `item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `item` MODIFY `price` INTEGER NOT NULL;
