import express from "express";

import { UserRoutes } from "../modules/user/user.routes";

import { AuthRoutes } from "../modules/auth/auth.routes";
import { BookRoutes } from "../modules/book/book.routes";

const router = express.Router();

const modules = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/books",
    route: BookRoutes,
  },
];

modules.forEach(route => router.use(route.path, route.route));

export default router;
