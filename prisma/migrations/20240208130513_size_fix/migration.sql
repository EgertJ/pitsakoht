/*
  Warnings:

  - You are about to alter the column `value` on the `size` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `size` MODIFY `value` ENUM('s', 'm', 'l') NOT NULL;
