-- DropForeignKey
ALTER TABLE `blog` DROP FOREIGN KEY `Blog_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `blogimage` DROP FOREIGN KEY `BlogImage_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blogtag` DROP FOREIGN KEY `BlogTag_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `blogtag` DROP FOREIGN KEY `BlogTag_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `userlike` DROP FOREIGN KEY `UserLike_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `userlike` DROP FOREIGN KEY `UserLike_userId_fkey`;

-- DropForeignKey
ALTER TABLE `usersave` DROP FOREIGN KEY `UserSave_blogId_fkey`;

-- DropForeignKey
ALTER TABLE `usersave` DROP FOREIGN KEY `UserSave_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userview` DROP FOREIGN KEY `UserView_blogId_fkey`;

-- AddForeignKey
ALTER TABLE `Blog` ADD CONSTRAINT `Blog_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogImage` ADD CONSTRAINT `BlogImage_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`blogId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogTag` ADD CONSTRAINT `BlogTag_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`blogId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlogTag` ADD CONSTRAINT `BlogTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `Tag`(`tagId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserView` ADD CONSTRAINT `UserView_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`blogId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLike` ADD CONSTRAINT `UserLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLike` ADD CONSTRAINT `UserLike_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`blogId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSave` ADD CONSTRAINT `UserSave_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSave` ADD CONSTRAINT `UserSave_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `Blog`(`blogId`) ON DELETE CASCADE ON UPDATE CASCADE;
