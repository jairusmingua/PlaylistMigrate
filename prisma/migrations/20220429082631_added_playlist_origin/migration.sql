-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "playlistId" TEXT;

-- AddForeignKey
ALTER TABLE "Playlist" ADD FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
