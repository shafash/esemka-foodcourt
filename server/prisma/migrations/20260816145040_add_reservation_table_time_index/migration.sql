/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Ingredients` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `Units` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `menus` ADD COLUMN `DeletedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ingredients_Name_key` ON `Ingredients`(`Name`);

-- CreateIndex
CREATE INDEX `Reservations_TableID_ReservationDate_ReservationTime_idx` ON `Reservations`(`TableID`, `ReservationDate`, `ReservationTime`);

-- CreateIndex
CREATE UNIQUE INDEX `Units_Name_key` ON `Units`(`Name`);
