import express from 'express';
import { WishlistCtrl } from './wishlist.controller';
import auth from '../../../middlewares/auth';

const router = express.Router();

router.post('/add-wishlist', WishlistCtrl.addBookWishlist);
router.get('/', auth(), WishlistCtrl.getWishlists);

export const WishlistRoute = router;
