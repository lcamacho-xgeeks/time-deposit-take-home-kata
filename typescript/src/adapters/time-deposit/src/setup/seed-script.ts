import { TimeDepositWithWithdrawal } from "@time-deposit-kata/time-deposit-domain";
import { Withdrawal } from "@time-deposit-kata/time-deposit-domain";
import { seedTimeDeposits } from "./TimeDepositDBSeed";

const deposits: TimeDepositWithWithdrawal[] = [
    new TimeDepositWithWithdrawal(1, 'basic', 5000, 90, []),
    new TimeDepositWithWithdrawal(2, 'premium', 10000, 180, [
        new Withdrawal(201, 500, new Date(2025, 2, 15))
    ]),
    new TimeDepositWithWithdrawal(3, 'student', 15000, 365, [
        new Withdrawal(301, 750, new Date(2025, 1, 10)),
        new Withdrawal(302, 1000, new Date(2025, 4, 20))
    ]),
    new TimeDepositWithWithdrawal(4, 'basic', 7500, 120, [
        new Withdrawal(401, 300, new Date(2025, 3, 5)),
        new Withdrawal(402, 400, new Date(2025, 6, 15)),
        new Withdrawal(403, 250, new Date(2025, 7, 25))
    ]),
    new TimeDepositWithWithdrawal(5, 'premium', 12000, 270, []),
    new TimeDepositWithWithdrawal(6, 'student', 20000, 365, [
        new Withdrawal(601, 2000, new Date(2025, 5, 10))
    ]),
    new TimeDepositWithWithdrawal(7, 'basic', 6000, 60, [
        new Withdrawal(701, 150, new Date(2025, 1, 25)),
        new Withdrawal(702, 200, new Date(2025, 7, 12))
    ]),
    new TimeDepositWithWithdrawal(8, 'premium', 9000, 150, []),
    new TimeDepositWithWithdrawal(9, 'student', 25000, 365, [
        new Withdrawal(901, 1500, new Date(2025, 0, 15)),
        new Withdrawal(902, 2500, new Date(2025, 6, 30)),
        new Withdrawal(903, 1000, new Date(2025, 7, 5))
    ]),
    new TimeDepositWithWithdrawal(10, 'basic', 8000, 90, [
        new Withdrawal(1001, 800, new Date(2025, 4, 18))
    ])
];

async function main() {
    try {
        console.log('Seeding 10 time deposits with 0-3 withdrawals each...');
        
        console.log('Deposits summary:');
        deposits.forEach(deposit => {
            console.log(`- Deposit ${deposit.id}: ${deposit.planType}, Balance: ${deposit.balance}, Days: ${deposit.days}, Withdrawals: ${deposit.withdrawals.length}`);
        });
        
        await seedTimeDeposits(deposits);
        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error running seed script:', error);
        process.exit(1);
    }
}

main();