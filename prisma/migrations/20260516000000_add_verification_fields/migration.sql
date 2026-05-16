-- Add REJECTED status to SellerStatus enum
ALTER TYPE "SellerStatus" ADD VALUE 'REJECTED';

-- Add verification fields to seller_kyc
ALTER TABLE "seller_kyc" ADD COLUMN "verification_video_url" TEXT;
ALTER TABLE "seller_kyc" ADD COLUMN "review_notes" TEXT;
