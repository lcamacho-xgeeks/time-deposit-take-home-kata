import { Hono } from 'hono';
import { Container } from './container';

const app = new Hono();
const container = Container.getInstance();

app.get('/deposits', async (c) => {
  const getAllDepositsUseCase = container.getGetAllDepositsUseCase();
  const deposits = getAllDepositsUseCase.getAllDeposits();
  return c.json(await deposits);
});

app.put('/deposits/update-balance', async (c) => {
  const updateBalanceUseCase = container.getUpdateBalanceUseCase();
  await updateBalanceUseCase.updateBalance();
  return c.json({ message: 'Balances updated successfully' });
});

export default app;