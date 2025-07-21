import { TimeDepositAggregate } from "../../entities/TimeDepositAggregate";

export interface TimeDepositAggregateRepository {
    getAllDepositsWithWithdrawals(): TimeDepositAggregate[];
}
