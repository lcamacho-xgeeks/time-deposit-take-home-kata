-- CreateTable
CREATE TABLE "timeDeposits" (
    "id" SERIAL NOT NULL,
    "planType" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "timeDeposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawals" (
    "id" SERIAL NOT NULL,
    "timeDepositId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdrawals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "withdrawals" ADD CONSTRAINT "withdrawals_timeDepositId_fkey" FOREIGN KEY ("timeDepositId") REFERENCES "timeDeposits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
