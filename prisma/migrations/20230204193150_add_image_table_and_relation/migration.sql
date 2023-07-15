/*
  Warnings:

  - You are about to drop the column `pictures` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `picturesRoute` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "pictures",
DROP COLUMN "picturesRoute",
ADD COLUMN     "imagesLocalRoute" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "cloudinaryId" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
