-- CreateTable
CREATE TABLE "ClothCategory" (
    "id" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "ClothCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllCloths" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "clothName" TEXT NOT NULL,

    CONSTRAINT "AllCloths_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AllCloths" ADD CONSTRAINT "AllCloths_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ClothCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
