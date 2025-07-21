import { InMemoryTimeDepositRepository } from '../repositories/InMemoryTimeDepositRepository'
import { TimeDeposit } from '../TimeDeposit'
import { TimeDepositCalculator } from '../TimeDepositCalculator'

describe('TimeDepositCalculator', () => {
  let repository: InMemoryTimeDepositRepository
  let calculator: TimeDepositCalculator

  describe('Basic plan type', () => {
    test('Should update basic balance when days > 30', () => {
      const deposits = [new TimeDeposit(1, 'basic', 1234567.0, 45)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(1235595.81)
    })

    test('Should not update basic balance when days <= 30', () => {
      const deposits = [new TimeDeposit(1, 'basic', 1000.0, 30)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(1000.0)
    })

    test('Should calculate basic interest correctly (1% annual)', () => {
      const deposits = [new TimeDeposit(1, 'basic', 12000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(12010.0)
    })
  })

  describe('Student plan type', () => {
    test('Should update student balance when days > 30 and < 366', () => {
      const deposits = [new TimeDeposit(1, 'student', 10000.0, 100)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10025.0)
    })

    test('Should not update student balance when days <= 30', () => {
      const deposits = [new TimeDeposit(1, 'student', 10000.0, 25)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should not update student balance when days >= 366', () => {
      const deposits = [new TimeDeposit(1, 'student', 10000.0, 400)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should calculate student interest correctly (3% annual)', () => {
      const deposits = [new TimeDeposit(1, 'student', 12000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(12030.0)
    })
  })

  describe('Premium plan type', () => {
    test('Should update premium balance when days > 45', () => {
      const deposits = [new TimeDeposit(1, 'premium', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10041.67)
    })

    test('Should not update premium balance when days <= 45', () => {
      const deposits = [new TimeDeposit(1, 'premium', 10000.0, 45)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should calculate premium interest correctly (5% annual)', () => {
      const deposits = [new TimeDeposit(1, 'premium', 12000.0, 90)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(12050.0)
    })
  })

  describe('Unknown plan type', () => {
    test('Should not update balance for unknown plan type', () => {
      const deposits = [new TimeDeposit(1, 'unknown', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })
  })

  describe('Edge cases - Day thresholds', () => {
    test('Should not apply interest when days = 30 (boundary case)', () => {
      const deposits = [new TimeDeposit(1, 'basic', 10000.0, 30)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Should apply interest when days = 31 (just over threshold)', () => {
      const deposits = [new TimeDeposit(1, 'basic', 12000.0, 31)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(12010.0)
    })

    test('Premium: Should not apply interest when days = 45 (boundary case)', () => {
      const deposits = [new TimeDeposit(1, 'premium', 10000.0, 45)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })

    test('Premium: Should apply interest when days = 46 (just over threshold)', () => {
      const deposits = [new TimeDeposit(1, 'premium', 12000.0, 46)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(12050.0)
    })

    test('Student: Should apply interest when days = 365 (just under threshold)', () => {
      const deposits = [new TimeDeposit(1, 'student', 12000.0, 365)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(12030.0)
    })

    test('Student: Should not apply interest when days = 366 (boundary case)', () => {
      const deposits = [new TimeDeposit(1, 'student', 10000.0, 366)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(10000.0)
    })
  })

  describe('Multiple deposits processing', () => {
    test('Should process multiple deposits of same plan type', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 60),
        new TimeDeposit(2, 'basic', 20000.0, 45)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()
      expect(updated[0].balance).toBe(10008.33)
      expect(updated[1].balance).toBe(20016.67)
    })

    test('Should process multiple deposits of different plan types', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 12000.0, 60),
        new TimeDeposit(2, 'student', 12000.0, 60),
        new TimeDeposit(3, 'premium', 12000.0, 60)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()
      expect(updated[0].balance).toBe(12010.0)
      expect(updated[1].balance).toBe(12030.0)
      expect(updated[2].balance).toBe(12050.0)
    })

    test('Should process mixed eligible and ineligible deposits', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 60),
        new TimeDeposit(2, 'basic', 10000.0, 20),
        new TimeDeposit(3, 'premium', 10000.0, 40),
        new TimeDeposit(4, 'student', 10000.0, 400)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()
      expect(updated[0].balance).toBe(10008.33)
      expect(updated[1].balance).toBe(10000.0)
      expect(updated[2].balance).toBe(10000.0)
      expect(updated[3].balance).toBe(10000.0)
    })
  })

  describe('Edge cases - Empty arrays and zero balances', () => {
    test('Should handle empty array gracefully', () => {
      const deposits: TimeDeposit[] = []
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      expect(repository.getAll().length).toBe(0)
    })

    test('Should handle zero balance deposits', () => {
      const deposits = [new TimeDeposit(1, 'basic', 0.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(0.0)
    })

    test('Should handle very small balance amounts', () => {
      const deposits = [new TimeDeposit(1, 'basic', 0.01, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(0.01)
    })

    test('Should handle large balance amounts', () => {
      const deposits = [new TimeDeposit(1, 'premium', 1000000000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.balance).toBe(1004166666.67)
    })
  })

  describe('Repository integration', () => {
    test('Should persist updates to repository', () => {
      const deposits = [new TimeDeposit(1, 'basic', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      const originalBalance = repository.getAll()[0].balance
      calculator.updateBalance(deposits)
      const updatedBalance = repository.getAll()[0].balance

      expect(originalBalance).toBe(10000.0)
      expect(updatedBalance).toBe(10008.33)
      expect(updatedBalance).not.toBe(originalBalance)
    })

    test('Should maintain deposit IDs after update', () => {
      const deposits = [
        new TimeDeposit(42, 'basic', 10000.0, 60),
        new TimeDeposit(99, 'student', 15000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()
      expect(updated[0].id).toBe(42)
      expect(updated[1].id).toBe(99)
    })

    test('Should maintain plan types after update', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 60),
        new TimeDeposit(2, 'student', 15000.0, 100),
        new TimeDeposit(3, 'premium', 20000.0, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()
      expect(updated[0].planType).toBe('basic')
      expect(updated[1].planType).toBe('student')
      expect(updated[2].planType).toBe('premium')
    })

    test('Should maintain days after update', () => {
      const deposits = [new TimeDeposit(1, 'basic', 10000.0, 75)]
      repository = new InMemoryTimeDepositRepository(deposits)
      calculator = new TimeDepositCalculator(repository)
      
      calculator.updateBalance(deposits)

      const updated = repository.getAll()[0]
      expect(updated.days).toBe(75)
    })
  })
})

