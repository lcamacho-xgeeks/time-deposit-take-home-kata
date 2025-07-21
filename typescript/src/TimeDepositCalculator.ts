import type { TimeDeposit } from './TimeDeposit'
import type { TimeDepositRepository } from './interfaces/TimeDepositRepository'

export class TimeDepositCalculator {

  constructor(private readonly timeDepositRepository: TimeDepositRepository) {}

  public updateBalance(timeDeposits: TimeDeposit[]) {
    this.calculateDepositInterests(timeDeposits)

    this.timeDepositRepository.updateAll(timeDeposits)
  };

  private calculateDepositInterests(timeDeposits: TimeDeposit[]) {
    for (let depositIndex = 0; depositIndex < timeDeposits.length; depositIndex++) {
      let interest = 0

      if (timeDeposits[depositIndex].days > 30) {
        if (timeDeposits[depositIndex].planType === 'student') {
          if (timeDeposits[depositIndex].days < 366) {
            interest += (timeDeposits[depositIndex].balance * 0.03) / 12
          }
        } else if (timeDeposits[depositIndex].planType === 'premium') {
          if (timeDeposits[depositIndex].days > 45) {
            interest += (timeDeposits[depositIndex].balance * 0.05) / 12
          }
        } else if (timeDeposits[depositIndex].planType === 'basic') {
          interest += (timeDeposits[depositIndex].balance * 0.01) / 12
        }
      }

      const roundedInterest = Math.round((interest + Number.EPSILON) * 100) / 100

      timeDeposits[depositIndex].balance += roundedInterest
    }
  }
}
