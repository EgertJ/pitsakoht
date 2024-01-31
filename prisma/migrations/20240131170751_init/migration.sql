-- CreateTable
CREATE TABLE `Toode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nimi` VARCHAR(191) NOT NULL,
    `pilt` VARCHAR(191) NOT NULL,
    `kategooriaId` INTEGER NOT NULL,

    UNIQUE INDEX `Toode_kategooriaId_key`(`kategooriaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategooria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nimi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Toode` ADD CONSTRAINT `Toode_kategooriaId_fkey` FOREIGN KEY (`kategooriaId`) REFERENCES `Kategooria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
