import { TimeDeposit } from "../../entities/TimeDeposit";

export interface TimeDepositRepository {
    updateAll(timeDeposits: TimeDeposit[]): Promise<void>;
    getAll(): Promise<TimeDeposit[]>;
}
