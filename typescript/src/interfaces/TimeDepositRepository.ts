import  type { TimeDeposit } from "../TimeDeposit";

export interface TimeDepositRepository {
    updateAll(timeDeposits: TimeDeposit[]);
    getAll(): TimeDeposit[];
}