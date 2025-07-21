import { TimeDeposit } from "../../entities/TimeDeposit";
import { TimeDepositAggregate } from "../../entities/TimeDepositAggregate";
import { TimeDepositAggregateRepository } from "./TimeDepositAggregateRepository.interface";
import { TimeDepositRepository } from "./TimeDepositRepository.interface";


export class InMemoryTimeDepositRepository implements TimeDepositRepository, TimeDepositAggregateRepository {
    constructor(private database: TimeDepositAggregate[] = []) {}

    getAllDepositsWithWithdrawals(): TimeDepositAggregate[] {
        return this.database
    }

    updateAll(timeDeposits: TimeDepositAggregate[]) {
        this.database = timeDeposits;
    }

    getAll(): TimeDeposit[] {
        return this.database
    }
}