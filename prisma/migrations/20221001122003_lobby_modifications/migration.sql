/*
  Warnings:

  - You are about to drop the `PlayerOnLobby` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PlayerOnLobby";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lobby" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "gameTypeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Lobby_gameTypeId_fkey" FOREIGN KEY ("gameTypeId") REFERENCES "GameType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Lobby_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Lobby" ("gameTypeId", "id", "name", "ownerId", "status") SELECT "gameTypeId", "id", "name", "ownerId", "status" FROM "Lobby";
DROP TABLE "Lobby";
ALTER TABLE "new_Lobby" RENAME TO "Lobby";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
