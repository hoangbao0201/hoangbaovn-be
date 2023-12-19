-- DropIndex
DROP INDEX `Blog_slug_key` ON `blog`;

-- AlterTable
ALTER TABLE `comment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE INDEX `Blog_blogId_idx` ON `Blog`(`blogId`);
