import express from 'express';
import Router from 'express-promise-router';

export const router = Router();
router.get('/', async (_req: express.Request, res: express.Response) => {
  res.send('initiate auth');
});

router.get('/login', async (_req: express.Request, res: express.Response) => {
  res.send('google provider login');
});

router.get('/logout', async (_req: express.Request, res: express.Response) => {
  res.send('google provider logout');
});

router.get(
  '/handler/frame',
  async (req: express.Request, res: express.Response) => {
    res.send('google provider frame response handler');
  },
);
