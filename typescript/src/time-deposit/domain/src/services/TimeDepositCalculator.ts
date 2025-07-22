import type { TimeDeposit } from "../entities/TimeDeposit"
import type { InterestCalculator } from "../ports/interest-calculators/InterestCalculator.interface"
import type { TimeDepositRepository } from "../ports/repositories/TimeDepositRepository.interface"

export class TimeDepositCalculator {

  constructor(
    private readonly timeDepositRepository: TimeDepositRepository,
    private readonly interestCalculators: InterestCalculator[]
  ) {}

  public async updateBalance(timeDeposits: TimeDeposit[]) {
    const timeDepositsWithInterests = this.calculateDepositInterests(timeDeposits)

    await this.timeDepositRepository.updateAll(timeDepositsWithInterests)
  }

  private calculateDepositInterests(timeDeposits: TimeDeposit[]) {
    return timeDeposits.map(deposit => {
      const calculator = this.getCalculator(deposit.planType)
      const interest = calculator?.calculateInterests(deposit) || 0 // if calculator is not found set interest to zero
      const balance = deposit.balance + interest
      return {
        ...deposit,
        balance
      }
    })
  }

  private getCalculator(planType: string) {
    return this.interestCalculators
      .find(calculator => calculator.planType === planType)
  }
}
