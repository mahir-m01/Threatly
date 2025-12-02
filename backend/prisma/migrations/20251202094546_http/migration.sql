-- CreateTable
CREATE TABLE "HttpObservatoryScan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "testsPassed" INTEGER NOT NULL,
    "testsFailed" INTEGER NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HttpObservatoryScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HttpObservatoryScan_projectId_scannedAt_idx" ON "HttpObservatoryScan"("projectId", "scannedAt");

-- AddForeignKey
ALTER TABLE "HttpObservatoryScan" ADD CONSTRAINT "HttpObservatoryScan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
