import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { findUserById } from '../models/userModel';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: 'Not logged in' });
  const user = await findUserById(req.session.userId);
  if (!user) return res.status(401).json({ message: 'Not logged in' });
  res.json({ username: user.username });
});

export default router;