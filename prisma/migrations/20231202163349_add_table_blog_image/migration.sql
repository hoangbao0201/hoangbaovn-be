-- CreateTable
CREATE TABLE `BlogImage` (
    `blogImageId` INTEGER NOT NULL AUTO_INCREMENT,
    `blogId` INTEGER NOT NULL,
    `urlImage` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`blogImageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlogImage` ADD CONSTRAINT `BlogImage_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`blogId`) ON DELETE RESTRICT ON UPDATE CASCADE;
