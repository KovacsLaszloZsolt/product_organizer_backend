/*
  Warnings:

  - You are about to drop the column `imagesLocalRoute` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "imagesLocalRoute",
ADD COLUMN     "imagesFolder" INTEGER,
ADD COLUMN     "imagesFolderId" INTEGER;

-- CreateTable
CREATE TABLE "ImagesFolder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "ImagesFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImagesFolder_id_key" ON "ImagesFolder"("id");

-- AddForeignKey
ALTER TABLE "ImagesFolder" ADD CONSTRAINT "ImagesFolder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
