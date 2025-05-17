import { Router } from 'express';
import groupController from '../controllers/groupController.js';
import auth from '../middleware/auth.js';
import validation from '../middleware/validation.js';

const router = Router();

router.post('/', auth, validation.validateGroup, groupController.createGroup);
router.get('/', auth, groupController.getGroups);
router.post('/:id/members', auth, groupController.addMember);
router.delete('/:id/members/:userId', auth, groupController.removeMember);

export default router;
