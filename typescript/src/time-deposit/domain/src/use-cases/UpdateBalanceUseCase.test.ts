import { UpdateBalanceUseCase } from './UpdateBalanceUseCase'
import { 
  InMemoryTimeDepositRepository, 
  TimeDepositCalculator,
  BasicPlanInterestCalculator,
  PremiumPlanInterestCalculator,
  StudentPlanInterestCalculator,
  TimeDepositWithWithdrawal,
  type InterestCalculator
} from "@time-deposit-kata/time-deposit-domain"

describe('UpdateBalanceUseCase', () => {
  let useCase: UpdateBalanceUseCase
  let repository: InMemoryTimeDepositRepository
  let calculator: TimeDepositCalculator
  const interestCalculators: InterestCalculator[] = [
    new BasicPlanInterestCalculator(), 
    new PremiumPlanInterestCalculator(), 
    new StudentPlanInterestCalculator()
  ]

  describe('updateBalance execution', () => {
    test('Should fetch all deposits and update their balances', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(2, 'premium', 20000.0, 90)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository, interestCalculators)
      useCase = new UpdateBalanceUseCase(repository, calculator)

      await useCase.updateBalance()

      const updated = await repository.getAll()
      expect(updated[0].balance).toBe(10008.33)
      expect(updated[1].balance).toBe(20083.33)
    })

    test('Should handle empty repository', async () => {
      repository = new InMemoryTimeDepositRepository([])
      calculator = new TimeDepositCalculator(repository, interestCalculators)
      useCase = new UpdateBalanceUseCase(repository, calculator)

      await useCase.updateBalance()

      const deposits = await repository.getAll()
      expect(deposits).toHaveLength(0)
    })

    test('Should process single deposit correctly', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 15000.0, 100)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository, interestCalculators)
      useCase = new UpdateBalanceUseCase(repository, calculator)

      await useCase.updateBalance()

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(15037.5)
    })

    test('Should process mixed eligible and ineligible deposits', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(2, 'basic', 10000.0, 20),
        new TimeDepositWithWithdrawal(3, 'premium', 10000.0, 40)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository, interestCalculators)
      useCase = new UpdateBalanceUseCase(repository, calculator)

      await useCase.updateBalance()

      const updated = await repository.getAll()
      expect(updated[0].balance).toBe(10008.33)
      expect(updated[1].balance).toBe(10000.0)
      expect(updated[2].balance).toBe(10000.0)
    })

    test('Should maintain deposit properties after update', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(42, 'premium', 25000.0, 75)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository, interestCalculators)
      useCase = new UpdateBalanceUseCase(repository, calculator)

      await useCase.updateBalance()

      const updated = (await repository.getAll())[0]
      expect(updated.id).toBe(42)
      expect(updated.planType).toBe('premium')
      expect(updated.days).toBe(75)
      expect(updated.balance).toBe(25104.17)
    })

    test('Should handle all plan types in single operation', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 12000.0, 60),
        new TimeDepositWithWithdrawal(2, 'student', 12000.0, 60),
        new TimeDepositWithWithdrawal(3, 'premium', 12000.0, 60)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository, interestCalculators)
      useCase = new UpdateBalanceUseCase(repository, calculator)

      await useCase.updateBalance()

      const updated = await repository.getAll()
      expect(updated[0].balance).toBe(12010.0)
      expect(updated[1].balance).toBe(12030.0)
      expect(updated[2].balance).toBe(12050.0)
    })
  })
})