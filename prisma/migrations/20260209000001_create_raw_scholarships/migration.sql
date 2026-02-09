-- Ensure pgcrypto is available for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('PENDING', 'PROCESSED', 'ERROR');

-- CreateTable
CREATE TABLE "raw_scholarships" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "ingestion_status" "IngestionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_scholarships_pkey" PRIMARY KEY ("id")
);

-- CreateIndexes
CREATE INDEX "raw_scholarships_ingestion_status_idx" ON "raw_scholarships"("ingestion_status");
CREATE INDEX "raw_scholarships_source_id_idx" ON "raw_scholarships"("source_id");