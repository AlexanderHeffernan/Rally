import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';
import { findUserById } from '../models/userModel';

const router = Router();

// Define post routes for registration, login, and logout
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Define a protected route to get current user info
router.get('/me', requireAuth, async (req, res) => {
    const session = req.session as { userId?: string };
    if (!session.userId) return res.status(401).json({ message: 'Not logged in' });
    const user = await findUserById(session.userId);
    if (!user) return res.status(401).json({ message: 'Not logged in' });
    res.json({ username: user.username });
});

export default router;