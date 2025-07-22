import { Hono } from 'hono';
import { Container } from './container';

const app = new Hono();
const container = Container.getInstance();

app.get('/deposits', (c) => {
  const getAllDepositsUseCase = container.getGetAllDepositsUseCase();
  const deposits = getAllDepositsUseCase.getAllDeposits();
  return c.json(deposits);
});

app.put('/deposits/update-balance', async (c) => {
  const updateBalanceUseCase = container.getUpdateBalanceUseCase();
  const timeDeposits = (await c.req.json()).deposits;
  updateBalanceUseCase.updateBalance(timeDeposits);
  return c.json({ message: 'Balances updated successfully' });
});

export default app;