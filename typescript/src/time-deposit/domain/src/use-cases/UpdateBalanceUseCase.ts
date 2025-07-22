import { TimeDepositRepository } from "../ports/repositories/TimeDepositRepository.interface";
import { TimeDepositCalculator } from "../services/TimeDepositCalculator";

export class UpdateBalanceUseCase {
    constructor(
        private readonly database: TimeDepositRepository,
        private readonly depositCalculator: TimeDepositCalculator
    ) {}

    public async updateBalance(): Promise<void> {
        const deposits = await this.database.getAll();
        await this.depositCalculator.updateBalance(deposits)
    }
}
