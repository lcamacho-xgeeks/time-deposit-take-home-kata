import type { TimeDepositWithWithdrawal } from "../../entities/TimeDepositAggregate";

export interface TimeDepositWithWithdrawalRepository {
    getAllDepositsWithWithdrawals(): Promise<TimeDepositWithWithdrawal[]>;
}
