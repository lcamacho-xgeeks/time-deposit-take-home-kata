import type { TimeDeposit } from "../../entities/TimeDeposit";
import type { TimeDepositWithWithdrawal } from "../../entities/TimeDepositAggregate";
import type { TimeDepositWithWithdrawalRepository } from "./TimeDepositWithdrawlRepository.interface";
import type { TimeDepositRepository } from "./TimeDepositRepository.interface";


export class InMemoryTimeDepositRepository implements TimeDepositRepository, TimeDepositWithWithdrawalRepository {
    constructor(private database: TimeDepositWithWithdrawal[] = []) {}

    getAllDepositsWithWithdrawals(): TimeDepositWithWithdrawal[] {
        return this.database
    }

    updateAll(timeDeposits: TimeDepositWithWithdrawal[]) {
        this.database = timeDeposits;
    }

    getAll(): TimeDeposit[] {
        return this.database
    }
}