import express from 'express';
import { AuthRoute } from '../auth/auth.route';
import { UserRoute } from '../users/users.route';
import { BookRoute } from '../books/book.route';
import { WishlistRoute } from '../wishlist/wishlist.route';
import { PlanToReadRoute } from '../planToRead/planToRead.route';
import { FinishedRoute } from '../finishedBook/finishedBook.route';

const router = express.Router();

export const moduleRoute = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/users',
    route: UserRoute,
  },
  {
    path: '/book',
    route: BookRoute,
  },
  {
    path: '/wishlist',
    route: WishlistRoute,
  },
  {
    path: '/plan-to-read',
    route: PlanToReadRoute,
  },
  {
    path: '/finished-book',
    route: FinishedRoute,
  },
];

moduleRoute.forEach(route => router.use(route.path, route.route));

export const routes = router;
