import type { TimeDepositRepository, TimeDepositWithWithdrawalRepository } from "@time-deposit-kata/time-deposit-domain"
import { TimeDeposit, TimeDepositWithWithdrawal, Withdrawal } from "@time-deposit-kata/time-deposit-domain"
import { PrismaClient } from "../generated/prisma"

export class SQLTimeDepositRepository implements TimeDepositRepository, TimeDepositWithWithdrawalRepository {
    
    constructor(private prisma: PrismaClient) { }

    async getAllDepositsWithWithdrawals(): Promise<TimeDepositWithWithdrawal[]> {
        const deposits = await this.prisma.timeDeposit.findMany({
            include: {
                withdrawals: true
            }
        })

        return deposits.map(deposit => new TimeDepositWithWithdrawal(
            deposit.id,
            deposit.planType,
            Number(deposit.balance),
            deposit.days,
            deposit.withdrawals.map(w => new Withdrawal(w.id, Number(w.amount), w.date))
        ))
    }

    async updateAll(timeDeposits: TimeDeposit[]): Promise<void> {
        await this.prisma.$transaction(
            timeDeposits.map(deposit =>
                this.prisma.timeDeposit.upsert({
                    where: { id: deposit.id },
                    update: {
                        planType: deposit.planType,
                        balance: deposit.balance,
                        days: deposit.days
                    },
                    create: {
                        id: deposit.id,
                        planType: deposit.planType,
                        balance: deposit.balance,
                        days: deposit.days
                    }
                })
            )
        )
    }

    async getAll(): Promise<TimeDeposit[]> {
        const deposits = (await this.prisma.timeDeposit.findMany())
        
        return deposits.map(deposit => new TimeDeposit(
            deposit.id,
            deposit.planType,
            Number(deposit.balance),
            deposit.days
        ))
    }

}