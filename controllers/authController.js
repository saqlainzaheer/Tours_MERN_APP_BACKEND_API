import User from '../models/User.js';
import { catchAsync } from './errorController.js';

export const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    status: true,
    data: user,
  });
});
