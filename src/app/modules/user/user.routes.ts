import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.get("/my-profile", UserController.getMyProfile);

export const UserRoutes = router;
