import { 
  GetAllDepositsUseCase,
  InMemoryTimeDepositRepository, 
  TimeDepositWithWithdrawal,
  Withdrawal
} from "@time-deposit-kata/time-deposit-domain"


describe('GetAllDepositsUseCase', () => {
  let repository: InMemoryTimeDepositRepository
  let useCase: GetAllDepositsUseCase

  describe('Basic functionality', () => {
    test('Should return all deposits from repository', async () => {
      const withdrawals1 = [new Withdrawal(1, 500.0, new Date('2024-01-15'))]
      const withdrawals2 = [new Withdrawal(2, 1000.0, new Date('2024-02-10')), new Withdrawal(3, 250.0, new Date('2024-02-20'))]
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60, withdrawals1),
        new TimeDepositWithWithdrawal(2, 'student', 15000.0, 100, withdrawals2),
        new TimeDepositWithWithdrawal(3, 'premium', 20000.0, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual(deposits[0])
      expect(result[1]).toEqual(deposits[1])
      expect(result[2]).toEqual(deposits[2])
      expect(result[0].withdrawals).toHaveLength(1)
      expect(result[0].withdrawals[0].amount).toBe(500.0)
      expect(result[1].withdrawals).toHaveLength(2)
      expect(result[1].withdrawals[0].amount).toBe(1000.0)
      expect(result[1].withdrawals[1].amount).toBe(250.0)
      expect(result[2].withdrawals).toEqual([])
    })

    test('Should return empty array when repository is empty', async () => {
      const deposits: TimeDepositWithWithdrawal[] = []
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    test('Should return single deposit when repository has one item', async () => {
      const withdrawals = [new Withdrawal(1, 5000.0, new Date('2024-03-15'))]
      const deposits = [new TimeDepositWithWithdrawal(42, 'premium', 50000.0, 120, withdrawals)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(deposits[0])
      expect(result[0].withdrawals).toHaveLength(1)
      expect(result[0].withdrawals[0].amount).toBe(5000.0)
    })
  })

  describe('Data integrity', () => {
    test('Should maintain deposit IDs correctly', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(999, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(1001, 'student', 15000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result[0].id).toBe(999)
      expect(result[1].id).toBe(1001)
      expect(result[0].withdrawals).toEqual([])
      expect(result[1].withdrawals).toEqual([])
    })

    test('Should maintain plan types correctly', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60),
        new TimeDepositWithWithdrawal(2, 'student', 15000.0, 100),
        new TimeDepositWithWithdrawal(3, 'premium', 20000.0, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result[0].planType).toBe('basic')
      expect(result[1].planType).toBe('student')
      expect(result[2].planType).toBe('premium')
      expect(result[0].withdrawals).toEqual([])
      expect(result[1].withdrawals).toEqual([])
      expect(result[2].withdrawals).toEqual([])
    })

    test('Should maintain balance amounts correctly', async () => {
      const withdrawals = [new Withdrawal(1, 100.0, new Date('2024-01-10'))]
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 1234.56, 60, withdrawals),
        new TimeDepositWithWithdrawal(2, 'student', 0.01, 100),
        new TimeDepositWithWithdrawal(3, 'premium', 1000000.99, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result[0].balance).toBe(1234.56)
      expect(result[1].balance).toBe(0.01)
      expect(result[2].balance).toBe(1000000.99)
      expect(result[0].withdrawals).toHaveLength(1)
      expect(result[0].withdrawals[0].amount).toBe(100.0)
      expect(result[1].withdrawals).toEqual([])
      expect(result[2].withdrawals).toEqual([])
    })

    test('Should maintain days correctly', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 30),
        new TimeDepositWithWithdrawal(2, 'student', 15000.0, 365),
        new TimeDepositWithWithdrawal(3, 'premium', 20000.0, 1000)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result[0].days).toBe(30)
      expect(result[1].days).toBe(365)
      expect(result[2].days).toBe(1000)
      expect(result[0].withdrawals).toEqual([])
      expect(result[1].withdrawals).toEqual([])
      expect(result[2].withdrawals).toEqual([])
    })
  })

  describe('Edge cases', () => {
    test('Should handle deposits with zero balance', async () => {
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 0.0, 60),
        new TimeDepositWithWithdrawal(2, 'student', 10000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(2)
      expect(result[0].balance).toBe(0.0)
      expect(result[1].balance).toBe(10000.0)
      expect(result[0].withdrawals).toEqual([])
      expect(result[1].withdrawals).toEqual([])
    })

    test('Should handle deposits with very small balances', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 0.001, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].balance).toBe(0.001)
      expect(result[0].withdrawals).toEqual([])
    })

    test('Should handle deposits with very large balances', async () => {
      const withdrawals = [new Withdrawal(1, 50000.0, new Date('2024-04-01'))]
      const deposits = [new TimeDepositWithWithdrawal(1, 'premium', 999999999.99, 60, withdrawals)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].balance).toBe(999999999.99)
      expect(result[0].withdrawals).toHaveLength(1)
      expect(result[0].withdrawals[0].amount).toBe(50000.0)
    })

    test('Should handle deposits with zero days', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 0)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].days).toBe(0)
      expect(result[0].withdrawals).toEqual([])
    })

    test('Should handle unknown plan types', async () => {
      const deposits = [new TimeDepositWithWithdrawal(1, 'unknown', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = await useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].planType).toBe('unknown')
      expect(result[0].withdrawals).toEqual([])
    })
  })

  describe('Multiple calls consistency', () => {
    test('Should return consistent results on multiple calls', async () => {
      const withdrawals = [new Withdrawal(1, 2500.0, new Date('2024-05-20'))]
      const deposits = [
        new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60, withdrawals),
        new TimeDepositWithWithdrawal(2, 'student', 15000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const firstCall = await useCase.getAllDeposits()
      const secondCall = await useCase.getAllDeposits()
      const thirdCall = await useCase.getAllDeposits()

      expect(firstCall).toEqual(secondCall)
      expect(secondCall).toEqual(thirdCall)
      expect(firstCall).toHaveLength(2)
      expect(firstCall[0].withdrawals).toHaveLength(1)
      expect(firstCall[0].withdrawals[0].amount).toBe(2500.0)
      expect(firstCall[1].withdrawals).toEqual([])
    })
  })
})
