/*
  Warnings:

  - You are about to drop the `State` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "State";

-- CreateTable
CREATE TABLE "GroupMessages" (
    "id" UUID NOT NULL,
    "messageId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GroupMessages_userId_idx" ON "GroupMessages"("userId");

-- CreateIndex
CREATE INDEX "GroupMessages_messageId_idx" ON "GroupMessages"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMessages_messageId_userId_key" ON "GroupMessages"("messageId", "userId");

-- AddForeignKey
ALTER TABLE "GroupMessages" ADD CONSTRAINT "GroupMessages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessages" ADD CONSTRAINT "GroupMessages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
