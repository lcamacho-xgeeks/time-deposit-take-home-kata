import type { TimeDepositWithWithdrawal } from "../entities/TimeDepositAggregate";
import { TimeDepositWithWithdrawalRepository } from "../ports/repositories/TimeDepositWithdrawalRepository.interface";

export class GetAllDepositsUseCase {
    constructor(private readonly database: TimeDepositWithWithdrawalRepository) {}

    public getAllDeposits(): Promise<TimeDepositWithWithdrawal[]> {
        return this.database.getAllDepositsWithWithdrawals()
    }
}
