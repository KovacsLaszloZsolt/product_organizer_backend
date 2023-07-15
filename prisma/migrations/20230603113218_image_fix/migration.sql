/*
  Warnings:

  - You are about to drop the `_ImageToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ImageToProduct" DROP CONSTRAINT "_ImageToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImageToProduct" DROP CONSTRAINT "_ImageToProduct_B_fkey";

-- DropTable
DROP TABLE "_ImageToProduct";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
