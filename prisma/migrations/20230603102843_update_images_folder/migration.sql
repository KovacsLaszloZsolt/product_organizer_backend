/*
  Warnings:

  - You are about to drop the column `productId` on the `ImagesFolder` table. All the data in the column will be lost.
  - You are about to drop the column `imagesFolder` on the `Product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ImagesFolder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `ImagesFolder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_productId_fkey";

-- DropForeignKey
ALTER TABLE "ImagesFolder" DROP CONSTRAINT "ImagesFolder_productId_fkey";

-- AlterTable
ALTER TABLE "ImagesFolder" DROP COLUMN "productId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imagesFolder";

-- CreateTable
CREATE TABLE "_ImageToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImageToProduct_AB_unique" ON "_ImageToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ImageToProduct_B_index" ON "_ImageToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ImagesFolder_name_key" ON "ImagesFolder"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_imagesFolderId_fkey" FOREIGN KEY ("imagesFolderId") REFERENCES "ImagesFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToProduct" ADD CONSTRAINT "_ImageToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageToProduct" ADD CONSTRAINT "_ImageToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
