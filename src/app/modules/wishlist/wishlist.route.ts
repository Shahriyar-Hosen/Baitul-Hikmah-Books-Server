import express from "express";
import auth from "../../middlewares/auth";
import { WishlistCtrl } from "./wishlist.controller";

const router = express.Router();

router.post("/add-wishlist", WishlistCtrl.addBookWishlist);
router.get("/", auth(), WishlistCtrl.getWishlists);

export const WishlistRoute = router;
