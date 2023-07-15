/*
  Warnings:

  - Made the column `originalName` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "originalName" SET NOT NULL;
