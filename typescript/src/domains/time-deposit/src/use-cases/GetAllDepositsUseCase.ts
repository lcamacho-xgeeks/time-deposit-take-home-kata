import { TimeDeposit } from "../entities/TimeDeposit";
import { TimeDepositRepository } from "../ports/repositories/TimeDepositRepository.interface";

export class GetAllDepositsUseCase {
    constructor(private readonly database: TimeDepositRepository) {}

    public getAllDeposits(): TimeDeposit[] {
        return this.database.getAll()
    }
}
