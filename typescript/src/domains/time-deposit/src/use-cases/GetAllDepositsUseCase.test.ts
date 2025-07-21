import { 
  GetAllDepositsUseCase,
  InMemoryTimeDepositRepository, 
  TimeDeposit,  
} from "@time-deposit-kata/time-deposit-domain"


describe('GetAllDepositsUseCase', () => {
  let repository: InMemoryTimeDepositRepository
  let useCase: GetAllDepositsUseCase

  describe('Basic functionality', () => {
    test('Should return all deposits from repository', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 60),
        new TimeDeposit(2, 'student', 15000.0, 100),
        new TimeDeposit(3, 'premium', 20000.0, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual(deposits[0])
      expect(result[1]).toEqual(deposits[1])
      expect(result[2]).toEqual(deposits[2])
    })

    test('Should return empty array when repository is empty', () => {
      const deposits: TimeDeposit[] = []
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(0)
      expect(result).toEqual([])
    })

    test('Should return single deposit when repository has one item', () => {
      const deposits = [new TimeDeposit(42, 'premium', 50000.0, 120)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(deposits[0])
    })
  })

  describe('Data integrity', () => {
    test('Should maintain deposit IDs correctly', () => {
      const deposits = [
        new TimeDeposit(999, 'basic', 10000.0, 60),
        new TimeDeposit(1001, 'student', 15000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result[0].id).toBe(999)
      expect(result[1].id).toBe(1001)
    })

    test('Should maintain plan types correctly', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 60),
        new TimeDeposit(2, 'student', 15000.0, 100),
        new TimeDeposit(3, 'premium', 20000.0, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result[0].planType).toBe('basic')
      expect(result[1].planType).toBe('student')
      expect(result[2].planType).toBe('premium')
    })

    test('Should maintain balance amounts correctly', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 1234.56, 60),
        new TimeDeposit(2, 'student', 0.01, 100),
        new TimeDeposit(3, 'premium', 1000000.99, 80)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result[0].balance).toBe(1234.56)
      expect(result[1].balance).toBe(0.01)
      expect(result[2].balance).toBe(1000000.99)
    })

    test('Should maintain days correctly', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 30),
        new TimeDeposit(2, 'student', 15000.0, 365),
        new TimeDeposit(3, 'premium', 20000.0, 1000)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result[0].days).toBe(30)
      expect(result[1].days).toBe(365)
      expect(result[2].days).toBe(1000)
    })
  })

  describe('Edge cases', () => {
    test('Should handle deposits with zero balance', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 0.0, 60),
        new TimeDeposit(2, 'student', 10000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(2)
      expect(result[0].balance).toBe(0.0)
      expect(result[1].balance).toBe(10000.0)
    })

    test('Should handle deposits with very small balances', () => {
      const deposits = [new TimeDeposit(1, 'basic', 0.001, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].balance).toBe(0.001)
    })

    test('Should handle deposits with very large balances', () => {
      const deposits = [new TimeDeposit(1, 'premium', 999999999.99, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].balance).toBe(999999999.99)
    })

    test('Should handle deposits with zero days', () => {
      const deposits = [new TimeDeposit(1, 'basic', 10000.0, 0)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].days).toBe(0)
    })

    test('Should handle unknown plan types', () => {
      const deposits = [new TimeDeposit(1, 'unknown', 10000.0, 60)]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const result = useCase.getAllDeposits()

      expect(result).toHaveLength(1)
      expect(result[0].planType).toBe('unknown')
    })
  })

  describe('Multiple calls consistency', () => {
    test('Should return consistent results on multiple calls', () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.0, 60),
        new TimeDeposit(2, 'student', 15000.0, 100)
      ]
      repository = new InMemoryTimeDepositRepository(deposits)
      useCase = new GetAllDepositsUseCase(repository)
      
      const firstCall = useCase.getAllDeposits()
      const secondCall = useCase.getAllDeposits()
      const thirdCall = useCase.getAllDeposits()

      expect(firstCall).toEqual(secondCall)
      expect(secondCall).toEqual(thirdCall)
      expect(firstCall).toHaveLength(2)
    })
  })
})
