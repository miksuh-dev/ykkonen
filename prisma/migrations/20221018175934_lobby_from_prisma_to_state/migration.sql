/*
  Warnings:

  - You are about to drop the `GameType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lobby` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameType";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Lobby";
PRAGMA foreign_keys=on;
