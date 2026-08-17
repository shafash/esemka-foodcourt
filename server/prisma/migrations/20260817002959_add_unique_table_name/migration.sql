/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Tables` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tables_Name_key` ON `Tables`(`Name`);
