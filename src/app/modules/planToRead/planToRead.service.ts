import { ApiError } from '../../../error/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { PlanToRead } from './planToRead.model';
import { IPlanToRead } from './planToRead.interface';

const addPlanToRead = async (payload: IPlanToRead) => {
  const result = await PlanToRead.create(payload);
  if (!result) {
    throw new ApiError(404, 'added Wishlist failed');
  }
  return result;
};

const getPlanToRead = async (user: JwtPayload | null) => {
  const result = await PlanToRead.find({ userEmail: user?.email }).lean();

  return {
    data: result,
  };
};

export const PlanToReadService = {
  addPlanToRead,
  getPlanToRead,
};
