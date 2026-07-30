/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Roles_Name_key` ON `Roles`(`Name`);
