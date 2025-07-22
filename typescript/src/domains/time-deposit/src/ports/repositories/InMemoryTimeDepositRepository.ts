import type { TimeDeposit } from "../../entities/TimeDeposit";
import type { TimeDepositWithWithdrawal } from "../../entities/TimeDepositAggregate";
import type { TimeDepositRepository } from "./TimeDepositRepository.interface";
import { TimeDepositWithWithdrawalRepository } from "./TimeDepositWithdrawalRepository.interface";


export class InMemoryTimeDepositRepository implements TimeDepositRepository, TimeDepositWithWithdrawalRepository {
    constructor(private database: TimeDepositWithWithdrawal[] = []) {}

    async getAllDepositsWithWithdrawals(): Promise<TimeDepositWithWithdrawal[]> {
        return this.database
    }

    async updateAll(timeDeposits: TimeDepositWithWithdrawal[]): Promise<void> {
        this.database = timeDeposits;
    }

    async getAll(): Promise<TimeDeposit[]> {
        return this.database
    }
}