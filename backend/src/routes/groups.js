import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import groupController from '../controllers/groupController.js';

const router = Router();

router.post('/', auth, validation.validateGroup, groupController.createGroup);
router.get('/', auth, groupController.getGroups);
router.post('/:id/members', auth, groupController.addMember);
router.delete('/:id/members/:userId', auth, groupController.removeMember);

export default router;
