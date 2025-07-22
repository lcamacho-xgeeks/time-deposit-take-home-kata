import { TimeDepositWithWithdrawal } from "@time-deposit-kata/time-deposit-domain";
import { PrismaClient } from "../generated/prisma";


export class TimeDepositDBSeed {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async seed(deposits: TimeDepositWithWithdrawal[]): Promise<void> {
        try {
            await this.cleanDatabase();
            await this.insertDeposits(deposits);
            console.log(`Successfully seeded ${deposits.length} time deposits with their withdrawals`);
        } catch (error) {
            console.error('Error seeding database:', error);
            throw error;
        } finally {
            await this.prisma.$disconnect();
        }
    }

    private async cleanDatabase(): Promise<void> {
        console.log('Cleaning database...');
        await this.prisma.withdrawal.deleteMany();
        await this.prisma.timeDeposit.deleteMany();
        console.log('Database cleaned successfully');
    }

    private async insertDeposits(deposits: TimeDepositWithWithdrawal[]): Promise<void> {
        console.log('Inserting time deposits...');
        
        for (const deposit of deposits) {
            await this.prisma.timeDeposit.create({
                data: {
                    id: deposit.id,
                    planType: deposit.planType,
                    balance: deposit.balance,
                    days: deposit.days,
                    withdrawals: {
                        create: deposit.withdrawals.map(withdrawal => ({
                            id: withdrawal.id,
                            amount: withdrawal.amount,
                            date: withdrawal.date
                        }))
                    }
                }
            });
        }
    }
}

export async function seedTimeDeposits(deposits: TimeDepositWithWithdrawal[]): Promise<void> {
    const seeder = new TimeDepositDBSeed();
    await seeder.seed(deposits);
}