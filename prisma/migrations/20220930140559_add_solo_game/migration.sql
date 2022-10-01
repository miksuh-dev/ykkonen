-- CreateTable
CREATE TABLE "GameType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GameType_name_key" ON "GameType"("name");

INSERT INTO "GameType" ("id", "name") VALUES (1, 'Solo');
