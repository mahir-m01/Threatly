-- CreateTable
CREATE TABLE "SSLLabsScan" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "hasWarnings" BOOLEAN NOT NULL,
    "supportsTLS13" BOOLEAN NOT NULL,
    "supportsTLS12" BOOLEAN NOT NULL,
    "supportsTLS11" BOOLEAN NOT NULL,
    "supportsTLS10" BOOLEAN NOT NULL,
    "certIssuer" TEXT,
    "certExpires" TIMESTAMP(3),
    "vulnHeartbleed" BOOLEAN NOT NULL,
    "vulnPoodle" BOOLEAN NOT NULL,
    "vulnFreak" BOOLEAN NOT NULL,
    "vulnLogjam" BOOLEAN NOT NULL,
    "vulnBeast" BOOLEAN NOT NULL,
    "hstsEnabled" BOOLEAN NOT NULL,
    "detailsUrl" TEXT,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SSLLabsScan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SSLLabsScan_projectId_scannedAt_idx" ON "SSLLabsScan"("projectId", "scannedAt");

-- AddForeignKey
ALTER TABLE "SSLLabsScan" ADD CONSTRAINT "SSLLabsScan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
