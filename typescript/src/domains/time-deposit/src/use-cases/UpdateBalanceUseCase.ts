import { InterestCalculator, TimeDeposit, TimeDepositRepository } from '@time-deposit-kata/time-deposit-domain'

export class UpdateBalanceUseCase {

  constructor(
    private readonly timeDepositRepository: TimeDepositRepository,
    private readonly interestCalculators: InterestCalculator[]
  ) {}

  public updateBalance(timeDeposits: TimeDeposit[]) {
    var timeDepositsWithInterests = this.calculateDepositInterests(timeDeposits)

    this.timeDepositRepository.updateAll(timeDepositsWithInterests)
  };

  private calculateDepositInterests(timeDeposits: TimeDeposit[]) {
    return timeDeposits.map(deposit => {
      const calculator = this.getCalculator(deposit.planType)
      let interest = calculator?.calculateInterests(deposit) || 0 // if calculator is not found set interest to zero
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
