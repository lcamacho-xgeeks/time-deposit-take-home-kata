import  { 
  BasicPlanInterestCalculator, 
  InMemoryTimeDepositRepository, 
  type InterestCalculator, 
  PremiumPlanInterestCalculator, 
  StudentPlanInterestCalculator, 
  TimeDepositWithWithdrawal, 
  UpdateBalanceUseCase 
} from "@time-deposit-kata/time-deposit-domain"


describe('UpdateBalanceUseCase', () => {
  let repository: InMemoryTimeDepositRepository
  let calculator: UpdateBalanceUseCase
  const interestCalculators: InterestCalculator[] = [
    new BasicPlanInterestCalculator(), 
    new PremiumPlanInterestCalculator(), 
    new StudentPlanInterestCalculator()
  ]

  describe('Basic plan type', () => {
    test('Should update basic balance when days > 30', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 1234567.0, 45)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(1235595.81)
    })

    test('Should not update basic balance when days <= 30', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 1000.0, 30)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(1000.0)
    })

    test('Should calculate basic interest correctly (1% annual)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 12000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(12010.0)
    })
  })

  describe('Student plan type', () => {
    test('Should update student balance when days > 30 and < 366', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 10000.0, 100)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10025.0)
    })

    test('Should not update student balance when days <= 30', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 10000.0, 25)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should not update student balance when days >= 366', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 10000.0, 400)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should calculate student interest correctly (3% annual)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 12000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(12030.0)
    })
  })

  describe('Premium plan type', () => {
    test('Should update premium balance when days > 45', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10041.67)
    })

    test('Should not update premium balance when days <= 45', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 10000.0, 45)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should calculate premium interest correctly (5% annual)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 12000.0, 90)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(12050.0)
    })
  })

  describe('Unknown plan type', () => {
    test('Should not update balance for unknown plan type', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'unknown', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })
  })

  describe('Edge cases - Day thresholds', () => {
    test('Should not apply interest when days = 30 (boundary case)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 30)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should apply interest when days = 31 (just over threshold)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 12000.0, 31)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(12010.0)
    })

    test('Premium: Should not apply interest when days = 45 (boundary case)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 10000.0, 45)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Premium: Should apply interest when days = 46 (just over threshold)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 12000.0, 46)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(12050.0)
    })

    test('Student: Should apply interest when days = 365 (just under threshold)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 12000.0, 365)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(12030.0)
    })

    test('Student: Should not apply interest when days = 366 (boundary case)', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'student', 10000.0, 366)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(10000.0)
    })
  })

  describe('Multiple deposits processing', () => {
    test('Should process multiple deposits of same plan type', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(2, 'basic', 20000.0, 45)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = await repository.getAll()
      expect(updated[0].balance).toBe(10008.33)
      expect(updated[1].balance).toBe(20016.67)
    })

    test('Should process multiple deposits of different plan types', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 12000.0, 60),
        new TimeDepositWithWithdrawal(2, 'student', 12000.0, 60),
        new TimeDepositWithWithdrawal(3, 'premium', 12000.0, 60)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = await repository.getAll()
      expect(updated[0].balance).toBe(12010.0)
      expect(updated[1].balance).toBe(12030.0)
      expect(updated[2].balance).toBe(12050.0)
    })

    test('Should process mixed eligible and ineligible deposits', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(2, 'basic', 10000.0, 20),
        new TimeDepositWithWithdrawal(3, 'premium', 10000.0, 40),
        new TimeDepositWithWithdrawal(4, 'student', 10000.0, 400)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = await repository.getAll()
      expect(updated[0].balance).toBe(10008.33)
      expect(updated[1].balance).toBe(10000.0)
      expect(updated[2].balance).toBe(10000.0)
      expect(updated[3].balance).toBe(10000.0)
    })
  })

  describe('Edge cases - Empty arrays and zero balances', () => {
    test('Should handle empty array gracefully', async () => {
      const deposits: TimeDepositWithWithdrawal[] = []
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      expect((await repository.getAll()).length).toBe(0)
    })

    test('Should handle zero balance deposits', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 0.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(0.0)
    })

    test('Should handle very small balance amounts', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 0.01, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(0.01)
    })

    test('Should handle large balance amounts', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 1000000000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.balance).toBe(1004166666.67)
    })
  })

  describe('Repository integration', () => {
    test('Should persist updates to repository', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      const originalBalance = (await repository.getAll())[0].balance
      await calculator.updateBalance(deposits)
      const updatedBalance = (await repository.getAll())[0].balance

      expect(originalBalance).toBe(10000.0)
      expect(updatedBalance).toBe(10008.33)
      expect(updatedBalance).not.toBe(originalBalance)
    })

    test('Should maintain deposit IDs after update', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(42, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(99, 'student', 15000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = await repository.getAll()
      expect(updated[0].id).toBe(42)
      expect(updated[1].id).toBe(99)
    })

    test('Should maintain plan types after update', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(2, 'student', 15000.0, 100),
        new TimeDepositWithWithdrawal(3, 'premium', 20000.0, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = await repository.getAll()
      expect(updated[0].planType).toBe('basic')
      expect(updated[1].planType).toBe('student')
      expect(updated[2].planType).toBe('premium')
    })

    test('Should maintain days after update', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 75)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new UpdateBalanceUseCase(repository, interestCalculators)
      
      await calculator.updateBalance(deposits)

      const updated = (await repository.getAll())[0]
      expect(updated.days).toBe(75)
    })
  })
})

