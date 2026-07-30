/*
  Warnings:

  - You are about to drop the `testconnection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `testconnection`;

-- CreateTable
CREATE TABLE `Roles` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(191) NOT NULL,
    `LastName` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `PhoneNumber` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `DateJoined` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `RoleID` INTEGER NOT NULL,

    UNIQUE INDEX `Users_Email_key`(`Email`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Menus` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryID` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NULL,
    `Price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ingredients` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Units` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MenuIngredients` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `MenuID` INTEGER NOT NULL,
    `IngredientID` INTEGER NOT NULL,
    `UnitID` INTEGER NOT NULL,
    `Qty` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tables` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reservations` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `CustomerFirstName` VARCHAR(191) NOT NULL,
    `CustomerLastName` VARCHAR(191) NOT NULL,
    `CustomerEmail` VARCHAR(191) NOT NULL,
    `CustomerPhoneNumber` VARCHAR(191) NOT NULL,
    `NumberOfPeople` INTEGER NOT NULL,
    `TableID` INTEGER NOT NULL,
    `ReservationDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReservationDetails` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ReservationID` INTEGER NOT NULL,
    `MenuID` INTEGER NOT NULL,
    `Qty` INTEGER NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_RoleID_fkey` FOREIGN KEY (`RoleID`) REFERENCES `Roles`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Menus` ADD CONSTRAINT `Menus_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `Categories`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuIngredients` ADD CONSTRAINT `MenuIngredients_MenuID_fkey` FOREIGN KEY (`MenuID`) REFERENCES `Menus`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuIngredients` ADD CONSTRAINT `MenuIngredients_IngredientID_fkey` FOREIGN KEY (`IngredientID`) REFERENCES `Ingredients`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuIngredients` ADD CONSTRAINT `MenuIngredients_UnitID_fkey` FOREIGN KEY (`UnitID`) REFERENCES `Units`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `Users`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_TableID_fkey` FOREIGN KEY (`TableID`) REFERENCES `Tables`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservationDetails` ADD CONSTRAINT `ReservationDetails_ReservationID_fkey` FOREIGN KEY (`ReservationID`) REFERENCES `Reservations`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservationDetails` ADD CONSTRAINT `ReservationDetails_MenuID_fkey` FOREIGN KEY (`MenuID`) REFERENCES `Menus`(`ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
