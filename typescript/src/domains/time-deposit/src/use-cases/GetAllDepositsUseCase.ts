import { TimeDepositAggregate } from "../entities/TimeDepositAggregate";
import { TimeDepositRepository } from "../ports/repositories/TimeDepositRepository.interface";

export class GetAllDepositsUseCase {
    constructor(private readonly database: TimeDepositRepository) {}

    public getAllDeposits(): TimeDepositAggregate[] {
        return this.database.getAllDepositsWithWithdrawals()
    }
}
