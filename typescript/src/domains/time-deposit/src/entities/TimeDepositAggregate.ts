import { Withdrawal } from "./Withdrawal"

export class TimeDepositAggregate {
  constructor(
    public id: number,
    public planType: string,
    public balance: number,
    public days: number,
    public withdrawals: Withdrawal[] = []
  ) { }
}
