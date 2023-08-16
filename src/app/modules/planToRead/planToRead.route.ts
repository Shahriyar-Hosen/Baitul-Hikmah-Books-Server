import express from 'express';
import auth from '../../../middlewares/auth';
import { PlanToReadCtrl } from './planToRead.controller';

const router = express.Router();

router.post('/add-planToRead', PlanToReadCtrl.addPlanToRead);
router.get('/', auth(), PlanToReadCtrl.getPlanToRead);

export const PlanToReadRoute = router;
