-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TEACHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "diagnosisDetails" TEXT,
    "supportLevel" TEXT NOT NULL DEFAULT 'LEVEL_1',
    "strengths" TEXT NOT NULL DEFAULT '[]',
    "challenges" TEXT NOT NULL DEFAULT '[]',
    "sensoryPreferences" TEXT NOT NULL DEFAULT '{"avoids":[],"seeks":[]}',
    "communicationStyle" TEXT NOT NULL DEFAULT 'VERBAL',
    "learningStyle" TEXT NOT NULL DEFAULT 'VISUAL',
    "interests" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPlan" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "focusArea" TEXT NOT NULL,
    "goals" TEXT NOT NULL DEFAULT '[]',
    "strategies" TEXT NOT NULL DEFAULT '[]',
    "accommodations" TEXT NOT NULL DEFAULT '[]',
    "materials" TEXT NOT NULL DEFAULT '[]',
    "weeklyStructure" TEXT NOT NULL DEFAULT '{}',
    "assessmentMethods" TEXT NOT NULL DEFAULT '[]',
    "rawResponse" TEXT NOT NULL,
    "promptUsed" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "blocks" TEXT NOT NULL DEFAULT '[]',
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressEntry" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "planId" TEXT,
    "goalDescription" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPlan" ADD CONSTRAINT "LearningPlan_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressEntry" ADD CONSTRAINT "ProgressEntry_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressEntry" ADD CONSTRAINT "ProgressEntry_planId_fkey" FOREIGN KEY ("planId") REFERENCES "LearningPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
