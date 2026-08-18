/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Categories_Name_key` ON `Categories`(`Name`);
