import { ApiError } from '../../../error/ApiError';
import { Wishlist } from './wishlist.model';
import { IWishlist } from './wishlist.interface';
import { JwtPayload } from 'jsonwebtoken';

const addBookWishlist = async (payload: IWishlist) => {
  const result = await Wishlist.create(payload);
  if (!result) {
    throw new ApiError(404, 'added Wishlist failed');
  }
  return result;
};

const getWishlists = async (user: JwtPayload | null) => {
  const result = await Wishlist.find({ userEmail: user?.email }).lean();

  return {
    data: result,
  };
};

export const WishlistService = {
  addBookWishlist,
  getWishlists,
};
