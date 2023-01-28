-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'BOOKED', 'SOLD');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'AVAILABLE';
