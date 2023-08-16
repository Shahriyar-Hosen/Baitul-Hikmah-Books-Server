import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post("/create-user", AuthController.createUser);
router.post(
  "/login-user",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

export const AuthRoute = router;
