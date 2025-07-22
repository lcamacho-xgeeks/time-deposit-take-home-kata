import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { Client } from 'pg';
import { PrismaClient } from '../generated/prisma';
import { SQLTimeDepositRepository } from './SQLTimeDepositRepository';
import { TimeDeposit, TimeDepositWithWithdrawal, Withdrawal } from '@time-deposit-kata/time-deposit-domain';

describe('SQLTimeDepositRepository', () => {
  let container: StartedTestContainer;
  let prismaClient: PrismaClient;
  let repository: SQLTimeDepositRepository;
  let dbUrl: string;

  beforeAll(async () => {
    container = await new GenericContainer('postgres:15')
      .withEnvironment({
        POSTGRES_PASSWORD: 'testpassword',
        POSTGRES_USER: 'testuser',
        POSTGRES_DB: 'testdb',
      })
      .withExposedPorts(5432)
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(5432);
    dbUrl = `postgresql://testuser:testpassword@${host}:${port}/testdb`;

    await runMigrations(dbUrl);

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });

    repository = new SQLTimeDepositRepository(prismaClient);
  }, 60000);

  afterAll(async () => {
    await prismaClient.$disconnect();
    await container.stop();
  });

  beforeEach(async () => {
    await prismaClient.withdrawal.deleteMany();
    await prismaClient.timeDeposit.deleteMany();
  });

  async function runMigrations(databaseUrl: string) {
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS "timeDeposits" (
        id SERIAL PRIMARY KEY,
        "planType" VARCHAR NOT NULL,
        days INTEGER NOT NULL,
        balance DECIMAL NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "withdrawals" (
        id SERIAL PRIMARY KEY,
        "timeDepositId" INTEGER NOT NULL,
        amount DECIMAL NOT NULL,
        date TIMESTAMP NOT NULL,
        FOREIGN KEY ("timeDepositId") REFERENCES "timeDeposits"(id) ON DELETE CASCADE
      );
    `);

    await client.end();
  }

  describe('getAllDepositsWithWithdrawals', () => {
    test('should return empty array when no deposits exist', async () => {
      const result = await repository.getAllDepositsWithWithdrawals();
      
      expect(result).toEqual([]);
    });

    test('should return deposits without withdrawals', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 10000.50,
          days: 60,
        },
      });

      const result = await repository.getAllDepositsWithWithdrawals();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        new TimeDepositWithWithdrawal(1, 'basic', 10000.50, 60, [])
      );
    });

    test('should return deposits with withdrawals', async () => {
      const deposit = await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'premium',
          balance: 25000.75,
          days: 90,
        },
      });

      await prismaClient.withdrawal.create({
        data: {
          id: 1,
          timeDepositId: deposit.id,
          amount: 5000.25,
          date: new Date('2024-01-15'),
        },
      });

      await prismaClient.withdrawal.create({
        data: {
          id: 2,
          timeDepositId: deposit.id,
          amount: 2500.50,
          date: new Date('2024-02-10'),
        },
      });

      const result = await repository.getAllDepositsWithWithdrawals();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].planType).toBe('premium');
      expect(result[0].balance).toBe(25000.75);
      expect(result[0].days).toBe(90);
      expect(result[0].withdrawals).toHaveLength(2);
      expect(result[0].withdrawals[0]).toEqual(new Withdrawal(1, 5000.25, new Date('2024-01-15')));
      expect(result[0].withdrawals[1]).toEqual(new Withdrawal(2, 2500.50, new Date('2024-02-10')));
    });

    test('should return multiple deposits with mixed withdrawals', async () => {
      const deposit1 = await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 15000.00,
          days: 30,
        },
      });

      const deposit2 = await prismaClient.timeDeposit.create({
        data: {
          id: 2,
          planType: 'student',
          balance: 8000.50,
          days: 180,
        },
      });

      await prismaClient.withdrawal.create({
        data: {
          timeDepositId: deposit1.id,
          amount: 1000.00,
          date: new Date('2024-03-01'),
        },
      });

      const result = await repository.getAllDepositsWithWithdrawals();

      expect(result).toHaveLength(2);
      
      const basicDeposit = result.find(d => d.planType === 'basic');
      const studentDeposit = result.find(d => d.planType === 'student');
      
      expect(basicDeposit?.withdrawals).toHaveLength(1);
      expect(studentDeposit?.withdrawals).toHaveLength(0);
    });
  });

  describe('updateAll', () => {
    test('should create new deposits when they do not exist', async () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.00, 60),
        new TimeDeposit(2, 'premium', 25000.50, 120),
      ];

      await repository.updateAll(deposits);

      const result = await prismaClient.timeDeposit.findMany({
        orderBy: { id: 'asc' },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        planType: 'basic',
        balance: expect.any(Object), // Prisma returns Decimal objects
        days: 60,
      });
      expect(Number(result[0].balance)).toBe(10000.00);
      expect(result[1]).toMatchObject({
        id: 2,
        planType: 'premium',
        balance: expect.any(Object),
        days: 120,
      });
      expect(Number(result[1].balance)).toBe(25000.50);
    });

    test('should update existing deposits', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 5000.00,
          days: 30,
        },
      });

      const updatedDeposits = [
        new TimeDeposit(1, 'premium', 15000.75, 90),
      ];

      await repository.updateAll(updatedDeposits);

      const result = await prismaClient.timeDeposit.findUnique({
        where: { id: 1 },
      });

      expect(result).toMatchObject({
        id: 1,
        planType: 'premium',
        balance: expect.any(Object),
        days: 90,
      });
      expect(Number(result!.balance)).toBe(15000.75);
    });

    test('should handle mixed create and update operations', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 5000.00,
          days: 30,
        },
      });

      const deposits = [
        new TimeDeposit(1, 'student', 7500.25, 45), // Update existing
        new TimeDeposit(2, 'premium', 20000.00, 180), // Create new
      ];

      await repository.updateAll(deposits);

      const result = await prismaClient.timeDeposit.findMany({
        orderBy: { id: 'asc' },
      });

      expect(result).toHaveLength(2);
      
      expect(result[0]).toMatchObject({
        id: 1,
        planType: 'student',
        days: 45,
      });
      expect(Number(result[0].balance)).toBe(7500.25);
      
      expect(result[1]).toMatchObject({
        id: 2,
        planType: 'premium',
        days: 180,
      });
      expect(Number(result[1].balance)).toBe(20000.00);
    });

    test('should handle empty array', async () => {
      await repository.updateAll([]);
      
      const result = await prismaClient.timeDeposit.findMany();
      expect(result).toHaveLength(0);
    });

    test('should maintain referential integrity with withdrawals', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 10000.00,
          days: 60,
        },
      });

      await prismaClient.withdrawal.create({
        data: {
          timeDepositId: 1,
          amount: 1000.00,
          date: new Date('2024-01-01'),
        },
      });

      const updatedDeposits = [
        new TimeDeposit(1, 'premium', 15000.00, 90),
      ];

      await repository.updateAll(updatedDeposits);

      const deposit = await prismaClient.timeDeposit.findUnique({
        where: { id: 1 },
        include: { withdrawals: true },
      });

      expect(deposit).toBeTruthy();
      expect(deposit!.planType).toBe('premium');
      expect(Number(deposit!.balance)).toBe(15000.00);
      expect(deposit!.withdrawals).toHaveLength(1);
    });
  });

  describe('getAll', () => {
    test('should return empty array when no deposits exist', async () => {
      const result = await repository.getAll();
      
      expect(result).toEqual([]);
    });

    test('should return all deposits without withdrawal information', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 10000.50,
          days: 60,
        },
      });

      await prismaClient.timeDeposit.create({
        data: {
          id: 2,
          planType: 'premium',
          balance: 25000.75,
          days: 120,
        },
      });

      await prismaClient.withdrawal.create({
        data: {
          timeDepositId: 1,
          amount: 1000.00,
          date: new Date('2024-01-01'),
        },
      });

      const result = await repository.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(new TimeDeposit(1, 'basic', 10000.50, 60));
      expect(result[1]).toEqual(new TimeDeposit(2, 'premium', 25000.75, 120));
    });

    test('should handle precision correctly for decimal amounts', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'basic',
          balance: 12345.67,
          days: 30,
        },
      });

      const result = await repository.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].balance).toBe(12345.67);
    });

    test('should handle zero balance correctly', async () => {
      await prismaClient.timeDeposit.create({
        data: {
          id: 1,
          planType: 'student',
          balance: 0.00,
          days: 90,
        },
      });

      const result = await repository.getAll();

      expect(result).toHaveLength(1);
      expect(result[0].balance).toBe(0.00);
    });

    test('should return deposits ordered consistently', async () => {
      const deposits = [
        { id: 3, planType: 'premium', balance: 30000.00, days: 180 },
        { id: 1, planType: 'basic', balance: 10000.00, days: 60 },
        { id: 2, planType: 'student', balance: 20000.00, days: 120 },
      ];

      for (const deposit of deposits) {
        await prismaClient.timeDeposit.create({ data: deposit });
      }

      const result = await repository.getAll();

      expect(result).toHaveLength(3);
      expect(result.map(d => d.id).sort((a, b) => a - b)).toEqual([1, 2, 3]);
    });
  });

  describe('error handling', () => {
    test('should handle database connection errors gracefully', async () => {
      const disconnectedPrisma = new PrismaClient({
        datasources: {
          db: {
            url: 'postgresql://invalid:invalid@localhost:9999/invalid',
          },
        },
      });
      
      const failingRepository = new SQLTimeDepositRepository(disconnectedPrisma);

      await expect(failingRepository.getAll()).rejects.toThrow();
      
      await disconnectedPrisma.$disconnect();
    });

    test('should handle constraint violations in updateAll', async () => {
      const deposits = [
        new TimeDeposit(1, 'basic', 10000.00, 60),
        new TimeDeposit(1, 'premium', 25000.00, 120), // Same ID - should cause upsert behavior
      ];

      await expect(repository.updateAll(deposits)).resolves.not.toThrow();

      const result = await prismaClient.timeDeposit.findMany();
      expect(result).toHaveLength(1);
      expect(result[0].planType).toBe('premium');
    });
  });
});