/*
  Warnings:

  - Added the required column `category` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ingredient` ADD COLUMN `category` ENUM('topping', 'sauce') NOT NULL;
