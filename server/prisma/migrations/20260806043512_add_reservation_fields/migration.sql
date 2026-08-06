/*
  Warnings:

  - Added the required column `ReservationTime` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `ReservationTime` VARCHAR(191) NOT NULL,
    ADD COLUMN `Status` VARCHAR(191) NOT NULL DEFAULT 'Pending';
