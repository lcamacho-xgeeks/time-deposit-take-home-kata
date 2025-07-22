import type { TimeDepositWithWithdrawal } from "../entities/TimeDepositAggregate";
import type { TimeDepositWithWithdrawalRepository } from "../ports/repositories/TimeDepositWithdrawlRepository.interface";

export class GetAllDepositsUseCase {
    constructor(private readonly database: TimeDepositWithWithdrawalRepository) {}

    public getAllDeposits(): TimeDepositWithWithdrawal[] {
        return this.database.getAllDepositsWithWithdrawals()
    }
}
