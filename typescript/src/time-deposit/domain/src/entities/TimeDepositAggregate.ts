import type { Withdrawal } from "./Withdrawal"

export class TimeDepositWithWithdrawal {
  constructor(
    public id: number,
    public planType: string,
    public balance: number,
    public days: number,
    public withdrawals: Withdrawal[] = []
  ) { }
}
