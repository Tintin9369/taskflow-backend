import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;
