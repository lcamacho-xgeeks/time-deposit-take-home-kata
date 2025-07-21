import { TimeDeposit } from "../../entities/TimeDeposit";

export interface TimeDepositRepository {
    updateAll(timeDeposits: TimeDeposit[]);
    getAll(): TimeDeposit[];
}
