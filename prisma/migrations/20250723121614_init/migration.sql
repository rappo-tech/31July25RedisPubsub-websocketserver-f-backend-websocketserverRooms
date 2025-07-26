-- CreateTable
CREATE TABLE "AllAdmins" (
    "id" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,

    CONSTRAINT "AllAdmins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllCategory" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "AllCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllProds" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "prodName" TEXT NOT NULL,

    CONSTRAINT "AllProds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AllCategory" ADD CONSTRAINT "AllCategory_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AllAdmins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllProds" ADD CONSTRAINT "AllProds_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AllCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
