import {
  GetAllDepositsUseCase,
  UpdateBalanceUseCase,
  InMemoryTimeDepositRepository,
  BasicPlanInterestCalculator,
  PremiumPlanInterestCalculator,
  StudentPlanInterestCalculator,
  type InterestCalculator,
  TimeDepositWithWithdrawal,
  Withdrawal
} from '@time-deposit-kata/time-deposit-domain';

export class Container {
  private static instance: Container;
  
  private timeDepositRepository: InMemoryTimeDepositRepository;
  private interestCalculators: InterestCalculator[];
  private getAllDepositsUseCase: GetAllDepositsUseCase;
  private updateBalanceUseCase: UpdateBalanceUseCase;

  private constructor() {
    const withdrawals1 = [new Withdrawal(1, 500.0, new Date('2024-01-15'))]
    const withdrawals2 = [new Withdrawal(2, 1000.0, new Date('2024-02-10')), new Withdrawal(3, 250.0, new Date('2024-02-20'))]
    const deposits = [
      new TimeDepositWithWithdrawal(1, 'basic', 10000.0, 60, withdrawals1),
      new TimeDepositWithWithdrawal(2, 'student', 15000.0, 100, withdrawals2),
      new TimeDepositWithWithdrawal(3, 'premium', 20000.0, 80)
    ]
    //This will replaced by a database repository
    this.timeDepositRepository = new InMemoryTimeDepositRepository(deposits);
    this.interestCalculators = [
      new BasicPlanInterestCalculator(),
      new PremiumPlanInterestCalculator(),
      new StudentPlanInterestCalculator()
    ];
    
    this.getAllDepositsUseCase = new GetAllDepositsUseCase(this.timeDepositRepository);
    this.updateBalanceUseCase = new UpdateBalanceUseCase(
      this.timeDepositRepository,
      this.interestCalculators
    );
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public getGetAllDepositsUseCase(): GetAllDepositsUseCase {
    return this.getAllDepositsUseCase;
  }

  public getUpdateBalanceUseCase(): UpdateBalanceUseCase {
    return this.updateBalanceUseCase;
  }

}