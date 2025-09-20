import { Router } from 'express';
import { createGroupHandler, getMyGroupsHandler, getGroupHandler, joinGroupHandler } from '../controllers/groupController';

const router = Router();

// Group routes
router.post('/', createGroupHandler);
router.get('/my', getMyGroupsHandler);
router.get('/:id', getGroupHandler);
router.post('/:id/join', joinGroupHandler);

export default router;