import {
  GetAllDepositsUseCase,
  UpdateBalanceUseCase,
  BasicPlanInterestCalculator,
  PremiumPlanInterestCalculator,
  StudentPlanInterestCalculator,
  type InterestCalculator,
  TimeDepositRepository,
  TimeDepositWithWithdrawalRepository
} from '@time-deposit-kata/time-deposit-domain';
import { SQLTimeDepositRepository, PrismaClient } from '@time-deposit-kata/time-deposit-adapters';
import { env } from 'node:process';

export class Container {
  private static instance: Container;
  
  private timeDepositRepository: TimeDepositRepository & TimeDepositWithWithdrawalRepository;
  private interestCalculators: InterestCalculator[];
  private getAllDepositsUseCase: GetAllDepositsUseCase;
  private updateBalanceUseCase: UpdateBalanceUseCase;

  private constructor() {
    const prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: env.DATABASE_URL,
        },
      },
    });
    //This will replaced by a database repository
    this.timeDepositRepository = new SQLTimeDepositRepository(prismaClient);
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