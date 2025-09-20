import { Router } from 'express';
import { createSessionHandler, getGroupSessionsHandler, getUserSessionsHandler, respondSessionHandler } from '../controllers/sessionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post('/', requireAuth, createSessionHandler);
router.get('/group/:groupId', requireAuth, getGroupSessionsHandler);
router.get('/my', requireAuth, getUserSessionsHandler);
router.post('/:sessionId/respond', requireAuth, respondSessionHandler);

export default router;