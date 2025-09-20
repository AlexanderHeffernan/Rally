import { Router } from 'express';
import { createGroupHandler, getMyGroupsHandler, getGroupHandler, joinGroupHandler, getGroupAvailabilitiesHandler } from '../controllers/groupController';

const router = Router();

// Group routes
router.post('/', createGroupHandler);
router.get('/my', getMyGroupsHandler);
router.get('/:id', getGroupHandler);
router.post('/:id/join', joinGroupHandler);
router.get('/:id/availabilities', getGroupAvailabilitiesHandler);

export default router;