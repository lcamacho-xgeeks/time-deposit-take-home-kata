import type { TimeDepositRepository } from "../interfaces/TimeDepositRepository";
import type { TimeDeposit } from "../TimeDeposit";

export class InMemoryTimeDepositRepository implements TimeDepositRepository {
    
    constructor(private database: TimeDeposit[] = []) {}

    updateAll(timeDeposits: TimeDeposit[]) {
        this.database = timeDeposits;
    }
    getAll(): TimeDeposit[] {
        return this.database
    } 

}