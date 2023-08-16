import express from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { BookRoute } from "../modules/books/book.route";
import { FinishedRoute } from "../modules/finishedBook/finishedBook.route";
import { PlanToReadRoute } from "../modules/planToRead/planToRead.route";
import { UserRoute } from "../modules/users/users.route";
import { WishlistRoute } from "../modules/wishlist/wishlist.route";

const router = express.Router();

export const moduleRoute = [
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/book",
    route: BookRoute,
  },
  {
    path: "/wishlist",
    route: WishlistRoute,
  },
  {
    path: "/plan-to-read",
    route: PlanToReadRoute,
  },
  {
    path: "/finished-book",
    route: FinishedRoute,
  },
];

moduleRoute.forEach(route => router.use(route.path, route.route));

export const routes = router;
