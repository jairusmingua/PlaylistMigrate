/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `external_id` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "external_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist.external_id_unique" ON "Playlist"("external_id");
