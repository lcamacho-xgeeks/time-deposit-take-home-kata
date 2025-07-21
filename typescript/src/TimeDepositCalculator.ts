import type { TimeDeposit } from './TimeDeposit'
import type { TimeDepositRepository } from './interfaces/TimeDepositRepository'

export class TimeDepositCalculator {

  constructor(private readonly timeDepositRepository: TimeDepositRepository) {}

  public updateBalance(timeDeposits: TimeDeposit[]) {
    var timeDepositsWithInterests = this.calculateDepositInterests(timeDeposits)

    this.timeDepositRepository.updateAll(timeDepositsWithInterests)
  };

  private calculateDepositInterests(timeDeposits: TimeDeposit[]) {
    return timeDeposits.map(deposit => {
      let interest = 0
      if (deposit.days > 30) {
        if (deposit.planType === 'student') {
          if (deposit.days < 366) {
            interest += (deposit.balance * 0.03) / 12
          }
        } else if (deposit.planType === 'premium') {
          if (deposit.days > 45) {
            interest += (deposit.balance * 0.05) / 12
          }
        } else if (deposit.planType === 'basic') {
          interest += (deposit.balance * 0.01) / 12
        }
      }
      const roundedInterest = Math.round((interest + Number.EPSILON) * 100) / 100
      const balance = deposit.balance + roundedInterest
      return {
        ...deposit,
        balance
      }
    })
  }
}
