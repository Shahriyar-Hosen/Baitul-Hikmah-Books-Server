import express, { Router } from 'express';
import { AuthCtrl } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../../middlewares/validateRequest';

const router = express.Router();

router.post('/create-user', AuthCtrl.createUser);
router.post(
  '/login-user',
  validateRequest(AuthValidation.loginZodSchema),
  AuthCtrl.loginUser
);

export const AuthRoute = router;
