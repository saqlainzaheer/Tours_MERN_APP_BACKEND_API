import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { jwt_sign } from './authController.js';
import { catchAsync } from './errorController.js';

export const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
export const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
export const updateUser = catchAsync(async (req, res, next) => {
  const { currentPass, newPassword } = req.body;

  if (!currentPass || !newPassword) {
    return next(new AppError('current and new Password required'));
  }

  if (!(await req.user.comparePasswords(currentPass, req.user.password))) {
    return next(new AppError('Current Password not match'));
  }
  const user = await User.findById(req.user.id);
  console.log(user);
  user.password = newPassword;
  user.confirmPassword = newPassword;
  const token = jwt_sign(user.id);
  await user.save();
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    token: token,
    user: user,
  });
});
export const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
