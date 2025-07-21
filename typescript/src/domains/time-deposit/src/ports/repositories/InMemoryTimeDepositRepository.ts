import { TimeDeposit } from "../../entities/TimeDeposit";
import type { TimeDepositRepository } from "./TimeDepositRepository.interface";

export class InMemoryTimeDepositRepository implements TimeDepositRepository {
    
    constructor(private database: TimeDeposit[] = []) {}

    updateAll(timeDeposits: TimeDeposit[]) {
        this.database = timeDeposits;
    }
    getAll(): TimeDeposit[] {
        return this.database
    } 

}