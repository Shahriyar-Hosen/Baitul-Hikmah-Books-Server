import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthCtrl } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post('/create-user', AuthCtrl.createUser);
router.post(
  '/login-user',
  validateRequest(AuthValidation.loginZodSchema),
  AuthCtrl.loginUser
);

export const AuthRoute = router;
