import express from 'express';
import auth from '../../../middlewares/auth';
import { FinishedBookCtrl } from './finishedBook.controller';

const router = express.Router();

router.post('/add-finished-book', FinishedBookCtrl.addFinishedBook);
router.get('/', auth(), FinishedBookCtrl.getFinishedBook);

export const FinishedRoute = router;
