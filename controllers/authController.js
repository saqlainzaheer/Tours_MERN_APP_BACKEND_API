import User, { comparePasswords } from '../models/User.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from './errorController.js';
import jwt from 'jsonwebtoken';

//genrating web token
const jwt_sign = (id) => {
  const payload = { id };
  const secretKey = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: process.env.JWT_EXPIRATION };

  return jwt.sign(payload, secretKey, options);
};

export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = jwt_sign(newUser._id);

  res.status(200).json({
    status: true,
    token: token,
    data: newUser,
  });
});

export const signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('email and password required', 401);
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await comparePasswords(password, user.password))) {
    throw new AppError('email or password incorrect!!');
  }
  const token = jwt_sign(user._id);
  res.status(200).json({
    status: 'success',
    token: token,
    data: user,
  });
});
