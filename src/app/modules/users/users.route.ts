import express from 'express';
import { UsersCtrl } from './users.controller';

const router = express.Router();

router.get('/', UsersCtrl.getAllUsers);
router.get('/:id', UsersCtrl.getSingleUser);

export const UserRoute = router;
