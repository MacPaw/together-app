-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "slackId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isMobilized" BOOLEAN NOT NULL DEFAULT false,
    "isExemptFromCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "isOptedOutOfMap" BOOLEAN NOT NULL DEFAULT false,
    "checkInToken" UUID,
    "isRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isUltraRestricted" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkins" (
    "id" UUID NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "isSafe" BOOLEAN NOT NULL,
    "isAbleToAssist" BOOLEAN NOT NULL,
    "isAbleToWork" BOOLEAN NOT NULL,
    "comment" TEXT,
    "memberId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_slackId_key" ON "members"("slackId");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- AddForeignKey
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
