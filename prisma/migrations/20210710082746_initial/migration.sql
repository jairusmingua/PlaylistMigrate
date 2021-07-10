-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('SPOTIFY', 'YOUTUBE');

-- CreateTable
CREATE TABLE "Playlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "platform" "Platform" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "image" TEXT,
    "urls" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "image" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlaylistToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AlbumToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlaylistToSong_AB_unique" ON "_PlaylistToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_PlaylistToSong_B_index" ON "_PlaylistToSong"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToSong_AB_unique" ON "_AlbumToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToSong_B_index" ON "_AlbumToSong"("B");

-- AddForeignKey
ALTER TABLE "Playlist" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistToSong" ADD FOREIGN KEY ("A") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistToSong" ADD FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToSong" ADD FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToSong" ADD FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
